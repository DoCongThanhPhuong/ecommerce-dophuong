'use strict'

const { NotFoundError } = require('~/core/error.response')
const commentModel = require('~/models/comment.model')
const { findOneProduct } = require('~/models/repositories/product.repo')
const { convertToMongoDBObjectId } = require('~/utils')

/**
 * Key features
 * 1. Add comment [User | Shop]
 * 2. Get a list of comments [User | Shop]
 * 3. Delete a comment [User | Shop | Admin]
 */
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null
  }) {
    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId
    })

    let rightValue
    if (parentCommentId) {
      // reply comment
      const parentComment = await commentModel.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError('Parent comment not found')

      rightValue = parentComment.comment_right
      // updateMany comments
      await commentModel.updateMany(
        {
          comment_productId: convertToMongoDBObjectId(productId),
          comment_right: { $gte: rightValue }
        },
        {
          $inc: { comment_right: 2 }
        }
      )

      await commentModel.updateMany(
        {
          comment_productId: convertToMongoDBObjectId(productId),
          comment_left: { $gt: rightValue }
        },
        {
          $inc: { comment_left: 2 }
        }
      )
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: convertToMongoDBObjectId(parentCommentId)
        },
        'comment_right',
        { sort: { comment_right: -1 } }
      )
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      } else {
        rightValue = 1
      }
    }

    // insert comment
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()
    return comment
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0 // skip
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId)
      if (!parent) throw new NotFoundError('Comment for product not found')

      const comments = await commentModel
        .find({
          comment_productId: convertToMongoDBObjectId(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lt: parent.comment_right }
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1
        })
        .sort({
          comment_left: 1
        })

      return comments
    }

    const comments = await commentModel
      .find({
        comment_productId: convertToMongoDBObjectId(productId),
        comment_parentId: parentCommentId
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1
      })
      .sort({
        comment_left: 1
      })

    return comments
  }

  static async deleteComment({ commentId, productId }) {
    // check product exists in db
    const foundProduct = await findOneProduct({ product_id: productId })
    if (!foundProduct) throw new NotFoundError('Product not found')

    // xac dinh left va right cua comment
    const comment = await commentModel.findById(commentId)
    if (!comment) throw new NotFoundError('Comment not found')

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right
    // tinh width
    const width = rightValue - leftValue + 1
    // xoa toan bo comment con
    await commentModel.deleteMany({
      comment_productId: convertToMongoDBObjectId(productId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })

    await commentModel.updateMany(
      {
        comment_productId: convertToMongoDBObjectId(productId),
        comment_right: { $gt: rightValue }
      },
      {
        $inc: { comment_right: -width }
      }
    )

    await commentModel.updateMany(
      {
        comment_productId: convertToMongoDBObjectId(productId),
        comment_left: { $gt: rightValue }
      },
      {
        $inc: { comment_left: -width }
      }
    )

    return true
  }
}

module.exports = CommentService
