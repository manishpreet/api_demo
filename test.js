console.log('first')
const Promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('second')
        resolve()
    }, 2000)
}).then(()=>{
    console.log('third')
})


