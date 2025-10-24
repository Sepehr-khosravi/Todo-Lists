interface todo{
    Get : string ,
    Add : string ,
    Edit : string ,
    Delete : string
}
interface auth {
    Signin : string,
    Signup : string
}
interface api {
    Auth : auth ,
    Todo : todo
}

interface data{
    Port : number,
    Server_Address : string,
    Api : api
}
//only for fun😂😂


const dataConfig : data = {
    Port : 5000,
    Server_Address : "http://localhost:5000",
    Api : {
        Auth : {
            Signin : "/auth/signin" ,
            Signup : "/auth/signup"
        },
        Todo : {
            Get : "/todo/" ,
            Add : "/todo/add" ,
            Edit : "/todo/edit" ,
            Delete : "/todo/delete"
        }
    }
}


export default dataConfig;