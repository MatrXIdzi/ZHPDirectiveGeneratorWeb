import Footer from "../Footer";
import MenuBar from "../menuBar/MenuBarGuest";

const LayoutGuest = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout-wrapper">
      <MenuBar />
      <main className="pt-20 px-4 flex-1 grid place-items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutGuest;
