import React, { useEffect, useState } from 'react'

export default function index() {

  const [product, setProduct] = useState([])

  // const getProduct = async () => {
  //   const resp = await fetch("/api/product/9352968306905");
  //   const data = await resp.json();
  //   setProduct(data)
  //   console.log(data)

  // }

  // useEffect(() => {
  //   getProduct()
  // }, [])

  return (
    <div>indexx</div>
  )
}
