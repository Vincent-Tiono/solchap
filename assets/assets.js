import gs_logo from "./gs_logo.jpg"
import upload_area from "./upload_area.svg"
import hero_model_img from "./hero_model_img.png"
import hero_product_img1 from "./hero_product_img1.png"
import hero_product_img2 from "./hero_product_img2.png"
import product_img1 from "./product_img1.png"
import product_img2 from "./product_img2.png"
import product_img3 from "./product_img3.png"
import product_img4 from "./product_img4.png"
import product_img5 from "./product_img5.png"
import product_img6 from "./product_img6.png"
import product_img7 from "./product_img7.png"
import product_img8 from "./product_img8.png"
import product_img9 from "./product_img9.png"
import product_img10 from "./product_img10.png"
import product_img11 from "./product_img11.png"
import product_img12 from "./product_img12.png"
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";
import makna_1 from "./makna_1.png"
import makna_2 from "./makna_2.png"

export const assets = {
    upload_area, hero_model_img,
    hero_product_img1, hero_product_img2, gs_logo,
    product_img1, product_img2, product_img3, product_img4, product_img5, product_img6,
    product_img7, product_img8, product_img9, product_img10, product_img11, product_img12,
}

export const productDummyData = [
        {
        id: "makna_1",
        name: "Blind Box (between Makna 1-35)",
        description: "Length: 60cm, Width: 10cm",
        // mrp: 40,
        prices: { IDR: 200000, HKD: 120, NTD: 400 },
        images: [makna_1],
        inStock: false,
        createdAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "makna_2",
        name: "Kain Makna 2",
        description: "Length: 60cm, Width: 10cm",
        // mrp: 40,
        prices: { IDR: 250000, HKD: 150, NTD: 500 },
        images: [makna_2],
        inStock: true,
        createdAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    // {
    //     id: "prod_1",
    //     name: "Modern table lamp",
    //     description: "Modern table lamp with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty. Enhance your audio experience with this earbuds. Indulge yourself in a world of pure sound with 50 hours of uninterrupted playtime. Equipped with the cutting-edge Zen Mode Tech ENC and BoomX Tech, prepare to be enthralled by a symphony of crystal-clear melodies.",
    //     // mrp: 40,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img1, product_img2, product_img3, product_img4],
    //     inStock: true,
    //     createdAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_2",
    //     name: "Smart speaker gray",
    //     description: "Smart speaker with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 50,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img2],
    //     inStock: true,
    //     createdAt: 'Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_3",
    //     name: "Smart watch white",
    //     description: "Smart watch with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 60,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img3],
    //     inStock: true,
    //     createdAt: 'Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_4",
    //     name: "Wireless headphones",
    //     description: "Wireless headphones with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 70,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img4],
    //     inStock: true,
    //     createdAt: 'Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_5",
    //     name: "Smart watch black",
    //     description: "Smart watch with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 49,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img5],
    //     inStock: true,
    //     createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_6",
    //     name: "Security Camera",
    //     description: "Security Camera with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 59,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img6],
    //     inStock: true,
    //     createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_7",
    //     name: "Smart Pen for iPad",
    //     description: "Smart Pen for iPad with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 89,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img7],
    //     inStock: true,
    //     createdAt: 'Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_8",
    //     name: "Home Theater",
    //     description: "Home Theater with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 99,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img8],
    //     inStock: true,
    //     createdAt: 'Sat Jul 23 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 23 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_9",
    //     name: "Apple Wireless Earbuds",
    //     description: "Apple Wireless Earbuds with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 89,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img9],
    //     inStock: true,
    //     createdAt: 'Sat Jul 22 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 22 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_10",
    //     name: "Apple Smart Watch",
    //     description: "Apple Smart Watch with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 179,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img10],
    //     inStock: true,
    //     createdAt: 'Sat Jul 21 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 21 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_11",
    //     name: "RGB Gaming Mouse",
    //     description: "RGB Gaming Mouse with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 39,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img11],
    //     inStock: true,
    //     createdAt: 'Sat Jul 20 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 20 2025 14:51:25 GMT+0530 (India Standard Time)',
    // },
    // {
    //     id: "prod_12",
    //     name: "Smart Home Cleaner",
    //     description: "Smart Home Cleaner with a sleek design. It's perfect for any room. It's made of high-quality materials and comes with a lifetime warranty.",
    //     // mrp: 199,
    //     prices: { IDR: 450000, HKD: 230, NTD: 950 },
    //     images: [product_img12],
    //     inStock: true,
    //     createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
    //     updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
    // }
];

export const ourSpecsData = [
    { title: "Free Shipping", description: "Enjoy fast, free delivery on every order no conditions, just reliable doorstep.", icon: SendIcon, accent: '#05DF72' },
    { title: "7 Days easy Return", description: "Change your mind? No worries. Return any item within 7 days.", icon: ClockFadingIcon, accent: '#FF8904' },
    { title: "24/7 Customer Support", description: "We're here for you. Get expert help with our customer support.", icon: HeadsetIcon, accent: '#A684FF' }
]

export const addressDummyData = {
    id: "addr_1",
    userId: "user_1",
    name: "John Doe",
    email: "johndoe@example.com",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: "1234567890",
    createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
}

export const couponDummyData = [
    { code: "NEW20", description: "20% Off for New Users", discount: 20, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:31.183Z" },
    { code: "NEW10", description: "10% Off for New Users", discount: 10, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:50.653Z" },
    { code: "OFF20", description: "20% Off for All Users", discount: 20, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:00.811Z" },
    { code: "OFF10", description: "10% Off for All Users", discount: 10, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:21.279Z" },
    { code: "PLUS10", description: "20% Off for Members", discount: 10, forNewUser: false, forMember: true, isPublic: false, expiresAt: "2027-03-06T00:00:00.000Z", createdAt: "2025-08-22T11:38:20.194Z" }
]

export const dummyUserData = {
    id: "user_31dQbH27HVtovbs13X2cmqefddM",
    name: "GreatStack",
    email: "greatstack@example.com",
    image: gs_logo,
    cart: {}
}

export const orderDummyData = [
    {
        id: "cmemm75h5001jtat89016h1p3",
        total: 214.2,
        currency: "HKD",
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:15:03.929Z",
        updatedAt: "2025-08-22T09:15:50.723Z",
        isCouponUsed: true,
        coupon: couponDummyData[0],
        orderItems: [
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlydnx0017tat8h3rg92hz", quantity: 1, price: 89, product: productDummyData[0], },
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlxgnk0015tat84qm8si5v", quantity: 1, price: 149, product: productDummyData[1], }
        ],
        address: addressDummyData,
        user: dummyUserData
    },
    {
        id: "cmemm6jv7001htat8vmm3gxaf",
        total: 421.6,
        currency: "HKD",
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:14:35.923Z",
        updatedAt: "2025-08-22T09:15:52.535Z",
        isCouponUsed: true,
        coupon: couponDummyData[0],
        orderItems: [
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm1f3y001dtat8liccisar", quantity: 1, price: 229, product: productDummyData[2], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm0nh2001btat8glfvhry1", quantity: 1, price: 99, product: productDummyData[3], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemlz8640019tat8kz7emqca", quantity: 1, price: 199, product: productDummyData[4], }
        ],
        address: addressDummyData,
        user: dummyUserData
    }
]

export const dummyAdminDashboardData = {
    "orders": 6,
    "products": 12,
    "revenue": "959.10",
    "allOrders": [
        { "createdAt": "2025-08-20T08:46:58.239Z", "total": 145.6 },
        { "createdAt": "2025-08-22T08:46:21.818Z", "total": 97.2 },
        { "createdAt": "2025-08-22T08:45:59.587Z", "total": 54.4 },
        { "createdAt": "2025-08-23T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-23T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-23T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-24T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-24T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-25T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:30:29.713Z", "total": 110.1 }
    ]
}

export const dummyStoreDashboardData = {
    "totalOrders": 2,
    "totalEarnings": 636,
    "totalProducts": 5
}
