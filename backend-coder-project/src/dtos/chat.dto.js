export default class ChatDto{
    constructor({_id, author, text, updatedAt}){
        this.id = _id,
        this.author = author,
        this.text = text,
        this.updatedAt = updatedAt
    }
}