  import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

  export const showFullDetailsOfColors = (e : React.MouseEvent<HTMLInputElement>, unit, router : AppRouterInstance) =>{
    e.stopPropagation();
    router.push(`palette/${unit._id}`)
  }