const ProductDescription = ({ product }) => {

    return (
        <div className="my-18 text-sm text-slate-600">
            <h2 className="text-base font-semibold text-slate-800 mb-3">Description</h2>
            <p className="max-w-xl">{product.description}</p>
        </div>
    )
}

export default ProductDescription
