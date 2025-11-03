import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../sidebar/Sidebar'
import Footer from '../footer/Footer'





export default function Layout({ children }) {
  const [headerClass, setHeaderClass] = useState("");

 // class add remove in header 
 useEffect(() => {
  window.addEventListener("scroll", scrollNavigation, true);
});

function scrollNavigation() {
  var scrollup = document.documentElement.scrollTop;
  if (scrollup > 50) {
      setHeaderClass("topbar-shadow");
  } else {
      setHeaderClass("");
  }
}

  return (
      <React.Fragment>
      <div id="layout-wrapper">
      <Header layoutType="vertical"/>
      <div className="layout-main" id="layout-wrapper">
        <Sidebar />
        <main className="content">
          {children}
        </main>
      </div>
      <Footer />
      </div>
      </React.Fragment>
  )
}