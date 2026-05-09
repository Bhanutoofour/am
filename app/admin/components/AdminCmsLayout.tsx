"use client";

import { Layout, Menu, type LayoutProps } from "react-admin";

const menuGroups = [
  {
    title: "Website",
    items: [
      { to: "/hero-section", label: "Hero banners" },
      { to: "/industries", label: "Industries" },
      { to: "/blogs", label: "Blogs" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { to: "/products", label: "Products" },
      { to: "/models", label: "Models" },
      { to: "/videos", label: "Videos" },
    ],
  },
  {
    title: "Sales",
    items: [{ to: "/dealers", label: "Dealers" }],
  },
];

const AdminCmsMenu = () => (
  <Menu
    sx={{
      padding: "16px 12px",
      "& .RaMenuItemLink-root": {
        borderRadius: "8px",
        fontWeight: 700,
        minHeight: 42,
      },
      "& .RaMenuItemLink-active": {
        backgroundColor: "#fff3bf",
        color: "#0a0a0b",
      },
    }}
  >
    {menuGroups.map((group) => (
      <div key={group.title}>
        <div
          style={{
            color: "#6b7280",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.7,
            margin: "18px 12px 8px",
            textTransform: "uppercase",
          }}
        >
          {group.title}
        </div>
        {group.items.map((item) => (
          <Menu.Item key={item.to} to={item.to} primaryText={item.label} />
        ))}
      </div>
    ))}
  </Menu>
);

export const AdminCmsLayout = (props: LayoutProps) => (
  <Layout
    {...props}
    menu={AdminCmsMenu}
    sx={{
      "& .RaLayout-appFrame": {
        marginTop: 0,
      },
      "& .RaSidebar-fixed": {
        borderRight: "1px solid #e5e7eb",
      },
      "& .RaAppBar-toolbar": {
        backgroundColor: "#05090c",
      },
    }}
  />
);
