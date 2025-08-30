const asyncHandler = (requstHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requstHandler(req,res,next)).catch((err)=>next(err))
    }
}
return {asyncHandler}







// const asyncHandler = (fn)=> async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
        
//     } catch (error) {
//         res.status(error.code || 5000).json({
//             success: false,
//             message: error.message,
//         })
        
//     }
// }