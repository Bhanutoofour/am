// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { HeroList } from "./components/HeroList";
import { HeroCreate } from "./components/HeroCreate";
import { HeroEdit } from "./components/HeroEdit";
import { IndustriesList } from "./components/IndustriesList";
import { IndustriesCreate } from "./components/IndustriesCreate";
import { IndustriesEdit } from "./components/IndustriesEdit";
import { ProductsList } from "./components/ProductsList";
import { ProductsCreate } from "./components/ProductsCreate";
import { ProductsEdit } from "./components/ProductsEdit";
import { ModelsList } from "./components/ModelsList";
import { ModelsCreate } from "./components/ModelsCreate";
import { ModelsEdit } from "./components/ModelsEdit";
import { DealersList } from "./components/DealersList";
import { DealersCreate } from "./components/DealersCreate";
import { DealersEdit } from "./components/DealersEdit";
import { VideosList } from "./components/VideosList";
import { VideosCreate } from "./components/VideosCreate";
import { VideosEdit } from "./components/VideosEdit";
import { BlogList } from "./blog-cms/components/BlogList";
import { BlogCreate } from "./blog-cms/components/BlogCreate";
import { BlogEdit } from "./blog-cms/components/BlogEdit";
import { isAdminAuthenticated, logoutAdmin } from "@/utils/auth";

const AdminPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use secure authentication check
    const authenticated = isAdminAuthenticated();

    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      // Clear any invalid data and redirect
      logoutAdmin();
      router.push("/admin/login");
    }

    setIsLoading(false);
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading admin panel...
      </div>
    );
  }

  // Show redirecting message if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Redirecting to login...
      </div>
    );
  }

  const dataProvider = simpleRestProvider("/api");

  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="hero-section"
        list={HeroList}
        create={HeroCreate}
        edit={HeroEdit}
      />
      <Resource
        name="industries"
        list={IndustriesList}
        create={IndustriesCreate}
        edit={IndustriesEdit}
      />
      <Resource
        name="products"
        list={ProductsList}
        create={ProductsCreate}
        edit={ProductsEdit}
      />
      <Resource
        name="models"
        list={ModelsList}
        create={ModelsCreate}
        edit={ModelsEdit}
      />
      <Resource
        name="dealers"
        list={DealersList}
        create={DealersCreate}
        edit={DealersEdit}
      />
      <Resource
        name="videos"
        list={VideosList}
        create={VideosCreate}
        edit={VideosEdit}
      />
      <Resource
        name="blogs"
        list={BlogList}
        create={BlogCreate}
        edit={BlogEdit}
      />
    </Admin>
  );
};

export default AdminPage;
