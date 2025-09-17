import QuizBuilder from "@/app/(components)/Modeltest";

export default async function Page({ params }) {
    const { subID } = await params;
    return (
        <div>
            <QuizBuilder subject={subID} />
        </div>
    )
}