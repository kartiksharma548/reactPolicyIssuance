type DialogProps={
    content:string,
    title:string,
    open:boolean,
    data?:any
    onClose?:(action:boolean,...rest:any)=>void
    dialogType:'confirm'|'alert'|string
}