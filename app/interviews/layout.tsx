import Footer from "@/components/Footer"
import Nav from "@/components/Navbar"

export default function InterviewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <><section>
      <Nav>{children}</Nav>

    </section><Footer></Footer></>
  )
}
