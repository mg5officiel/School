const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function token(){return localStorage.getItem("accessToken")}
async function request(path,options={}){
  const headers=new Headers(options.headers||{});
  if(options.body && !(options.body instanceof FormData)) headers.set("Content-Type","application/json");
  const t=token(); if(t) headers.set("Authorization","Bearer "+t);
  let r=await fetch(API_URL+path,{...options,headers});
  if(r.status===401 && !path.startsWith("/auth/")){
    const refresh=localStorage.getItem("refreshToken");
    if(refresh){
      const rr=await fetch(API_URL+"/auth/refresh",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:refresh})});
      if(rr.ok){
        const data=await rr.json();localStorage.setItem("accessToken",data.accessToken);if(data.refreshToken)localStorage.setItem("refreshToken",data.refreshToken);
        headers.set("Authorization","Bearer "+data.accessToken);r=await fetch(API_URL+path,{...options,headers});
      }
    }
  }
  if(r.status===401){localStorage.clear();window.location.href="/";throw new Error("Session expirée")}
  if(!r.ok){let message="Erreur API";try{const d=await r.json();message=d.message||d.error||message}catch{}throw new Error(message)}
  if(r.status===204)return null;
  const type=r.headers.get("content-type")||"";return type.includes("application/json")?r.json():r.text();
}
export const api={
  get:path=>request(path),
  post:(path,body)=>request(path,{method:"POST",body:body instanceof FormData?body:JSON.stringify(body)}),
  put:(path,body)=>request(path,{method:"PUT",body:JSON.stringify(body)}),
  del:path=>request(path,{method:"DELETE"}),
  logout:async()=>{const refresh=localStorage.getItem("refreshToken");if(refresh){try{await request("/auth/logout",{method:"POST",body:JSON.stringify({refreshToken:refresh})})}catch{}}localStorage.clear()},
  download:async path=>{let t=token();let r=await fetch(API_URL+path,{headers:t?{Authorization:"Bearer "+t}:{}});if(r.status===401){const refresh=localStorage.getItem("refreshToken");if(refresh){const rr=await fetch(API_URL+"/auth/refresh",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:refresh})});if(rr.ok){const d=await rr.json();localStorage.setItem("accessToken",d.accessToken);if(d.refreshToken)localStorage.setItem("refreshToken",d.refreshToken);t=d.accessToken;r=await fetch(API_URL+path,{headers:{Authorization:"Bearer "+t}})}}}if(!r.ok)throw new Error("Téléchargement impossible");return r.blob()}
};
export {API_URL};