const BASE="https://local-service-marketplace-backend-hj37.onrender.com/api";
export async function api(path, options={}){
 const token=localStorage.getItem("token");
 const headers={...(options.body instanceof FormData?{}:{"Content-Type":"application/json"}),...(token?{Authorization:`Bearer ${token}`}:{})};
 const r=await fetch(BASE+path,{...options,headers});
 const data=await r.json().catch(()=>({}));
 if(!r.ok) throw new Error(data.message||"Request failed");
 return data;
}
