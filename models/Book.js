var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var bookSchema = new Schema ({
    title: {type: String, required: true, index: true},
    comments: { type: [String], default: [] },
    commentcount: {type: Number, default: 0}
});

bookSchema.set('toObject', {
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
    },
});

module.exports = mongoose.model('Book', bookSchema);