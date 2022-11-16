export default class UserDto{
    constructor({name, email, address, age, avatar, phone, role, id, cartId}){
        this.name = name,
        this.email = email,
        this.address = address,
        this.age = age,
        this.avatar = avatar,
        this.phone = phone,
        this.role = role,
        this.id = id,
        this.cartId = cartId
    }
}