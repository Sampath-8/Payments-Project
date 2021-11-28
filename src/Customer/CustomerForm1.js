import axios from "axios";
import { useState } from "react";

// import { useParams } from "react-router";

function CustomerForm(){
    const [bookingDate,setBookingDate]=useState("");
    const [customerId,setCustomerId]=useState("");
    const [customerName,setCustomerName]=useState("");
    const [overDraft,setOverDraft]=useState("");
    const [clearBalance,setClearBalance]=useState("");
    const [ifscCode,setIfscCode]=useState("");
    const [bankName,setBankName]=useState("");
    const [recieverName,setRecieverName]=useState("");
    const [recieverAccNum,setRecieverAccNum]=useState("");
    const [transferAmount,setTransferAmount]=useState("");
    const [transferFee,setTransferFee]=useState("");
    const [transferType,setTransferType]=useState("");
    const [messageCode,setMessageCode]=useState("");
    

    
    const onClickHandle=(evt)=>{
        console.log(customerId);
        if(evt.target.value ===""){
            alert("Enter Customer Id");
        }else{
            axios.get(`http://localhost:8082/customer/${customerId}`)
            .then((response)=>{
                if(response.data.customer_name===undefined){
                    alert("Enter Valid Customer Id")
                }else{
                setCustomerName(response.data.customer_name);
                setOverDraft(response.data.overdraft);
                setClearBalance(response.data.account_balance);
                console.log(response);
                
            }}).catch(error => {
                alert("Customer Not Found");
            })
        }
        evt.preventDefault();
    }

    const handleRecieverBank=(e)=>{
        // console.log("Clicked")
        axios.get(`http://localhost:8082/bank/${ifscCode}`)
        .then((response)=>{
            console.log(response);
            setBankName(response.data.bank_name);
        })
        e.preventDefault();
    }

    const handleTransferFee=(evt)=>{
        
        
        var fee=(transferAmount*0.25)/100;
        setTransferFee(fee);
    }
    const handleTransfer=(evt)=>{
        console.log(transferType)
        const header={
            transaction_type:transferType,
            transaction_amount:transferAmount,
            customer_id:customerId,
            receiver_id:recieverAccNum,
            receiver_name:recieverName,
            receiver_bic:ifscCode,
            transaction_status:"",
            message_code:messageCode,
            transaction_id:"",
            transaction_date:""
        }
        const body={"Content-Type":"application/json"}
        if(transferType==="Bank Transfer" && bankName==="HDFC BANK LIMITED" && customerName.substring(0,4)==="HDFC"){
            if(transferAmount>clearBalance && overDraft=="yes"){
                axios.post(
                    "http://localhost:8082/transaction",
                    header,
                    {headers:body}
                 ).catch(error=>{
                     alert("Receiver Name is found in SDN List");
                 })
            }
            else
            if(transferAmount<clearBalance){
                axios.post(
                    "http://localhost:8082/transaction",
                    header,
                    {headers:body}
                 ).catch(error=>{
                     alert("Receiver Name is found in SDN List");
                 })
            }
            else{
                alert("Cannot Initiate transfer")
            }
        }else
        if(transferType==="Customer Transfer"){
            if(transferAmount>clearBalance && overDraft=="yes"){
                axios.post(
                    "http://localhost:8082/transaction",
                    header,
                    {headers:body}
                 ).catch(error=>{
                     alert("Receiver Name is found in SDN List");
                 })
            }
            else
            if(transferAmount<clearBalance){
                axios.post(
                    "http://localhost:8082/transaction",
                    header,
                    {headers:body}
                 ).catch(error=>{
                     alert("Receiver Name is found in SDN List");
                 })
            }
            else{
                alert("Cannot Initiate transfer")
            }
        }
        
    }
    
    
    return <div>
        <h2>Enter Customer Details</h2>
        
       
        <form>
            
            {/* Enter Booking Date:<input type="date" placeholder="Select Date" onChange={(evt)=>setBookingDate(evt.target.value)} value={bookingDate}></input><br/><br/> */}
            Enter Customer ID:<input type="text" name="customerId" onChange={(evt)=>{setCustomerId(evt.target.value)}} onBlur={onClickHandle} value={customerId}  placeholder="Customer ID"/><br/><br/>
            Customer Name:<input type="text"  placeholder="Account Holder Name" value={customerName} disabled={true} /><br/><br/>
            Account Balance: <input type="number"  placeholder="Clear Balance" value={clearBalance} disabled={true} /><br/><br/>
            OverDraft: <input type="text"  placeholder="Ovderdraft" value={overDraft} disabled={true} />
            <br/><br/>
                   
            <h2>Reciever Bank Details</h2>
            Enter IFSC Code:<input type="text" name="ifscCode" onChange={(evt)=>{setIfscCode(evt.target.value)}} onBlur={handleRecieverBank} value={ifscCode} placeholder="Enter IFSC Code"></input><br/>
            Bank Name: <input type="text" name="bankName" value={bankName} disabled={true}></input><br/>
            
            Enter Reciever Name:<input type="text" name="recieverName"  value={recieverName} onChange={(evt)=>setRecieverName(evt.target.value)}></input><br/>
            Enter Reciever Account Num:<input type="number" name="recieverAccNum"  value={recieverAccNum} onChange={(evt)=>setRecieverAccNum(evt.target.value)}></input>
        <br/>
        <h2>Transaction Details:</h2>
            <label>Transfer type:</label>
            <select name="transferType" id="tranferType" value={transferType} onChange={(evt)=>setTransferType(evt.target.value)} >
                <option>Select Transfer Type</option>
                <option value="Customer Transfer">Customer Transfer</option>
                <option value="Bank Transfer">Bank Transfer</option>
            </select><br/>
            <label>Message Code</label>
            <select name="messageCode" value={messageCode} onChange={(evt)=>setMessageCode(evt.target.value)}>
                <option>Select Message Code</option>
                <option value="CHQB">CHQB</option>
                <option value="CORT">CORT</option>
                <option value="HOLD">HOLD</option>
                <option value="INTC">INTC</option>
                <option value="PHOB">PHOB</option>
                <option value="PHOI">PHOI</option>
                <option value="PHON">PHON</option>
                <option value="REPA">REPA</option>
                <option value="SDVA">SDVA</option>
            </select><br/>
            Enter Transfer Amount:
            <input type="number" name="tranferAmount" value={transferAmount} onChange={(evt)=>setTransferAmount(evt.target.value)} onBlur={handleTransferFee}></input><br/>
            Transfer Fee:{transferFee}<br/><br/>
            
            <input type="button" value="Initiate Transfer" onClick={handleTransfer}></input>
            
        </form>
       
    </div>
}
export default CustomerForm;