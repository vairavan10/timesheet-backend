const mongoose=require('mongoose')
const projectSchema= new mongoose.Schema({
    name: {
    type: String,
    required: true,
    unique: true,
    },
}, { timestamps: true });
module.exports = mongoose.model('Project', projectSchema);
