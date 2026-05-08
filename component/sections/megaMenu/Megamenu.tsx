import styles from "./menuStyles.module.scss";
import ProductMenu from "./Product";
import IndustryMenu from "./Industry";

export interface MegaMenuProps {
  menuFrom: string;
  industries: ActiveIndustry[];
  products: ActiveProduct[];
  onHide: () => void;
}

const Megamenu: React.FC<MegaMenuProps> = ({
  menuFrom,
  industries,
  products,
  onHide,
}) => {
  return (
    <div className={`${styles.megamenu}`}>
      {menuFrom === "industry" && (
        <IndustryMenu industryItems={industries} onHide={onHide} />
      )}
      {menuFrom === "product" && (
        <ProductMenu ProductItems={products} onHide={onHide} />
      )}
    </div>
  );
};

export default Megamenu;
