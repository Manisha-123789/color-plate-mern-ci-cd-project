import { ColorDetails } from "@/component/ColorDetails/ColorDetails";

interface ProductPageProps {
  params: {
    id: string;
  };
}



export default function Page({params} : ProductPageProps) {
 const id = params.id;
 console.log(id, 'kkkkkkkkkkk')
  return (
    <ColorDetails id={id}/>
    
  )
}
