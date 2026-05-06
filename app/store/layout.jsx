import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Solar Chapter - Kain Makna",
    description: "Solar Chapter - Kain Makna",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
