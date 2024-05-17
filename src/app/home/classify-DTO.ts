export interface ClassifyResponce { 
    success:String,
    message:String,
    data:{
        ovdType:String
    },
    requestId:String
} 

export interface ClassifyRequest {
    imageData:String
}
export interface ILoaction{
    latitude:String,
    longitude:String
}