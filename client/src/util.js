
export async function getInvoiceItems(){
    var res = {};
    var result = {};
    console.log('in util.js');

    res =  await fetch("/api/getinvoiceitems");
    result = await res.json();
    console.log(result);
    // setData(result);
    return result;
}
