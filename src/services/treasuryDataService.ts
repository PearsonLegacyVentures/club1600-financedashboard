import budgetSource from "@/data/club1600_budget.json";
import duesSource from "@/data/club1600_dues.json";
import issuesSource from "@/data/club1600_issues.json";
import membersSource from "@/data/club1600_members.json";
import metaSource from "@/data/club1600_meta.json";
import transactionsSource from "@/data/club1600_transactions.json";

export type TxType = "inflow" | "outflow";
export type RecordStatus = "posted" | "voided" | "needs_review";
export type Payment = { id:string; date:string | null; amount:number; method:string | null; status:RecordStatus; issues:string[] };
export type Transaction = { id:string; date:string | null; rawDate?:string; itemNumber?:number; type:TxType; category:string; description:string; amount:number; account:string; method:string; reference?:string; notes?:string; receipt?:string; status:RecordStatus; issues?:string[]; batchId?:string };
export type BudgetLine = { item:number; name:string; type:TxType; amount:number; prior:number; legacyActual:number; rationale?:string; group?:string };
export type Member = { id:string; name:string; type:"Existing"|"New"; expected:number; payments:Payment[]; computedStatus:string; notes:string | null; special?:"Covered by Club"|"Exempt / Waived" };
export type DataIssue = { entity:string; legacy_id:string; description?:string; member_name?:string; issue:string; raw_value:string | null };
export type TreasuryState = { transactions:Transaction[]; members:Member[] };

const STORAGE_KEY = "club1600-treasury-working-data-v1";
const eventGroups:Record<number,string>={6:"installation",7:"ladies-night",8:"back-to-school",10:"family-fun-day",11:"boil-fish",12:"socials",13:"past-presidents",14:"leadership-tour",15:"membership-drives",17:"speech-contest",18:"the-pitch",21:"ladies-night",22:"installation",24:"socials",25:"back-to-school",32:"past-presidents",35:"boil-fish",36:"family-fun-day",45:"leadership-tour",46:"membership-drives",50:"speech-contest",51:"the-pitch"};

export const meta = metaSource;
export const issues = issuesSource as DataIssue[];
export const budget:BudgetLine[] = budgetSource.map(line=>({item:line.item_number,name:line.name,type:line.type as TxType,amount:line.budget_amount,prior:line.prior_year_budget,legacyActual:line.legacy_workbook_actual,rationale:line.budget_rationale,group:eventGroups[line.item_number]}));

function sourceState():TreasuryState {
  const paymentsByMember = new Map<string,Payment[]>();
  for(const payment of duesSource){
    const payments=paymentsByMember.get(payment.member_legacy_id)??[];
    payments.push({id:payment.legacy_id,date:payment.payment_date,amount:payment.amount,method:payment.payment_method_or_note,status:payment.status as RecordStatus,issues:payment.issues});
    paymentsByMember.set(payment.member_legacy_id,payments);
  }
  const members:Member[]=membersSource.map(member=>({id:member.legacy_id,name:member.full_name,type:member.member_type==="new"?"New":"Existing",expected:member.expected_dues,payments:paymentsByMember.get(member.legacy_id)??[],computedStatus:member.computed_status,notes:member.notes,special:member.computed_status==="covered_by_club"?"Covered by Club":undefined}));
  const transactions:Transaction[]=transactionsSource.map(transaction=>({id:transaction.legacy_id,date:transaction.transaction_date,rawDate:transaction.raw_date,itemNumber:transaction.item_number,type:transaction.type as TxType,category:budget.find(line=>line.item===transaction.item_number)?.name??transaction.category,description:transaction.description,amount:transaction.amount,account:"Operating account",method:"Legacy record",status:transaction.status as RecordStatus,issues:transaction.issues}));
  return {transactions,members};
}

const clone=<T,>(value:T):T=>JSON.parse(JSON.stringify(value));
export function loadTreasuryData():TreasuryState {
  if(typeof window==="undefined") return sourceState();
  const saved=window.localStorage.getItem(STORAGE_KEY);
  if(!saved){const initial=sourceState();saveTreasuryData(initial);return initial;}
  try{return JSON.parse(saved) as TreasuryState;}catch{return sourceState();}
}
export function saveTreasuryData(state:TreasuryState){if(typeof window!=="undefined")window.localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
export function resetTreasuryData():TreasuryState {const initial=clone(sourceState());saveTreasuryData(initial);return initial;}
export const postedTransactions=(transactions:Transaction[])=>transactions.filter(record=>record.status==="posted");
export const postedPayments=(members:Member[])=>members.flatMap(member=>member.payments).filter(payment=>payment.status==="posted");
export function calculateActuals({transactions,members}:TreasuryState){
  const validTransactions=postedTransactions(transactions);
  const transactionInflows=validTransactions.filter(record=>record.type==="inflow").reduce((sum,record)=>sum+record.amount,0);
  const outflows=validTransactions.filter(record=>record.type==="outflow").reduce((sum,record)=>sum+record.amount,0);
  const dues=postedPayments(members).reduce((sum,payment)=>sum+payment.amount,0);
  const inflows=transactionInflows+dues;
  return {transactionInflows,dues,inflows,outflows,net:inflows-outflows};
}
export const money=(n:number)=>new Intl.NumberFormat("en-BS",{style:"currency",currency:meta.currency,minimumFractionDigits:2}).format(n);
export const pct=(n:number)=>`${Math.round(n)}%`;
export const monthIndex=(date:string|null)=>{if(!date||date<meta.program_year_start||date>meta.program_year_end)return -1;const d=new Date(`${date}T12:00:00`);return(d.getMonth()+6)%12};
export const quarterFor=(date:string|null)=>{const month=monthIndex(date);return month<0?"Outside program year":`Q${Math.floor(month/3)+1}`};
