  import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

  export const showFullDetailsOfColors = (e : React.MouseEvent<HTMLInputElement>, unit, router : AppRouterInstance) =>{
    console.log(unit, 'uuuuuu')
    e.stopPropagation();
    console.log('hhhhh', unit)
    router.push(`palette/${unit.id}`)
  }