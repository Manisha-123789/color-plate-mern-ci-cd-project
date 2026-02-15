import { ColorDetails } from "@/component/ColorDetails/ColorDetails";

interface ProductPageProps {
  params: {
    id: string;
  };
}



export default function Page({params} : ProductPageProps) {
 const id = params.id;
  return (
    <ColorDetails id={id}/>
    
  )
}
