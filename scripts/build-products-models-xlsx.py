import json
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
from xml.sax.saxutils import escape


SOURCE = Path("outputs/product-models/product-models-data.json")
OUTPUT = Path("outputs/product-models/autocracy-products-models-specs.xlsx")


def col_name(index):
    name = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        name = chr(65 + remainder) + name
    return name


def cell_ref(row, col):
    return f"{col_name(col)}{row}"


def clean(value):
    if value is None:
        return ""
    if isinstance(value, bool):
        return "Yes" if value else "No"
    text = str(value)
    return "".join(ch for ch in text if ch == "\n" or ch == "\t" or ord(ch) >= 32)


def cell_xml(row, col, value, style=1):
    ref = cell_ref(row, col)
    value = clean(value)
    if value == "":
        return f'<c r="{ref}" s="{style}"/>'
    return (
        f'<c r="{ref}" t="inlineStr" s="{style}">'
        f"<is><t>{escape(value)}</t></is>"
        f"</c>"
    )


def row_xml(row_index, values, style=1, height=None):
    attrs = f' r="{row_index}"'
    if height:
        attrs += f' ht="{height}" customHeight="1"'
    cells = "".join(cell_xml(row_index, col + 1, value, style) for col, value in enumerate(values))
    return f"<row{attrs}>{cells}</row>"


def worksheet_xml(rows, widths, title_rows=1, freeze=True, autofilter=True):
    total_rows = len(rows)
    total_cols = max((len(row) for row in rows), default=1)
    dimension = f"A1:{cell_ref(max(total_rows, 1), max(total_cols, 1))}"
    cols = "".join(
        f'<col min="{idx}" max="{idx}" width="{width}" customWidth="1"/>'
        for idx, width in enumerate(widths, start=1)
    )
    sheet_views = ""
    if freeze:
        sheet_views = (
            "<sheetViews><sheetView workbookViewId=\"0\">"
            "<pane ySplit=\"1\" topLeftCell=\"A2\" activePane=\"bottomLeft\" state=\"frozen\"/>"
            "<selection pane=\"bottomLeft\"/>"
            "</sheetView></sheetViews>"
        )
    sheet_rows = []
    for idx, values in enumerate(rows, start=1):
        if idx <= title_rows:
            sheet_rows.append(row_xml(idx, values, style=2, height=24))
        else:
            sheet_rows.append(row_xml(idx, values, style=1, height=54))
    filter_xml = f'<autoFilter ref="A1:{cell_ref(total_rows, total_cols)}"/>' if autofilter and total_rows > 1 else ""
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<dimension ref=\"{dimension}\"/>"
        f"{sheet_views}"
        f"<cols>{cols}</cols>"
        f"<sheetData>{''.join(sheet_rows)}</sheetData>"
        f"{filter_xml}"
        "</worksheet>"
    )


def workbook_xml(sheet_names):
    sheets = "".join(
        f'<sheet name="{escape(name)}" sheetId="{idx}" r:id="rId{idx}"/>'
        for idx, name in enumerate(sheet_names, start=1)
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<sheets>{sheets}</sheets>"
        "</workbook>"
    )


def workbook_rels(sheet_names):
    rels = []
    for idx, _name in enumerate(sheet_names, start=1):
        rels.append(
            f'<Relationship Id="rId{idx}" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
            f'Target="worksheets/sheet{idx}.xml"/>'
        )
    styles_id = len(sheet_names) + 1
    rels.append(
        f'<Relationship Id="rId{styles_id}" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" '
        'Target="styles.xml"/>'
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        f"{''.join(rels)}"
        "</Relationships>"
    )


def content_types(sheet_count):
    sheets = "".join(
        f'<Override PartName="/xl/worksheets/sheet{idx}.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        for idx in range(1, sheet_count + 1)
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        '<Override PartName="/xl/styles.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        f"{sheets}"
        '<Override PartName="/docProps/core.xml" '
        'ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '<Override PartName="/docProps/app.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        "</Types>"
    )


def root_rels():
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
        'Target="xl/workbook.xml"/>'
        '<Relationship Id="rId2" '
        'Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" '
        'Target="docProps/core.xml"/>'
        '<Relationship Id="rId3" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" '
        'Target="docProps/app.xml"/>'
        "</Relationships>"
    )


def styles_xml():
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        "<fonts count=\"2\">"
        '<font><sz val="10"/><color rgb="FF01060A"/><name val="Arial"/></font>'
        '<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>'
        "</fonts>"
        "<fills count=\"4\">"
        '<fill><patternFill patternType="none"/></fill>'
        '<fill><patternFill patternType="gray125"/></fill>'
        '<fill><patternFill patternType="solid"><fgColor rgb="FF01060A"/><bgColor indexed="64"/></patternFill></fill>'
        '<fill><patternFill patternType="solid"><fgColor rgb="FFF5F5F5"/><bgColor indexed="64"/></patternFill></fill>'
        "</fills>"
        "<borders count=\"2\">"
        "<border><left/><right/><top/><bottom/><diagonal/></border>"
        '<border><left style="thin"><color rgb="FFD7D7D7"/></left>'
        '<right style="thin"><color rgb="FFD7D7D7"/></right>'
        '<top style="thin"><color rgb="FFD7D7D7"/></top>'
        '<bottom style="thin"><color rgb="FFD7D7D7"/></bottom><diagonal/></border>'
        "</borders>"
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
        '<cellXfs count="3">'
        '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
        '<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyAlignment="1" applyBorder="1" applyFill="1">'
        '<alignment vertical="top" wrapText="1"/></xf>'
        '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyAlignment="1" applyBorder="1" applyFill="1" applyFont="1">'
        '<alignment vertical="center" wrapText="1"/></xf>'
        "</cellXfs>"
        '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
        "</styleSheet>"
    )


def core_xml():
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" '
        'xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        "<dc:title>Autocracy Products Models Specs</dc:title>"
        "<dc:creator>Codex</dc:creator>"
        f'<dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>'
        f'<dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>'
        "</cp:coreProperties>"
    )


def app_xml():
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
        'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
        "<Application>Microsoft Excel</Application>"
        "</Properties>"
    )


def build():
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    products = data["products"]
    rows = data["rows"]
    specs_long = data["specsLong"]

    model_count_by_product = {}
    for row in rows:
        if row.get("modelId"):
            model_count_by_product[row["productId"]] = model_count_by_product.get(row["productId"], 0) + 1

    summary_rows = [
        ["Autocracy Products / Models Export", ""],
        ["Generated At", data.get("generatedAt", "")],
        ["Products", len(products)],
        ["Models", len(data["models"])],
        ["Spec Rows", len(specs_long)],
        ["Notes", "Product rows are followed by their models in the Product Models sheet. Specs are also split into a filterable long-form sheet."],
    ]

    products_rows = [[
        "Product Order",
        "Product ID",
        "Product Name",
        "Active",
        "Description",
        "Series",
        "Model Count",
    ]]
    for index, product in enumerate(products, start=1):
        products_rows.append([
            index,
            product.get("id", ""),
            product.get("title", ""),
            product.get("active", ""),
            product.get("description", ""),
            ", ".join(product.get("series") or []),
            model_count_by_product.get(product.get("id"), 0),
        ])

    product_model_rows = [[
        "Product Order",
        "Product Name",
        "Product Description",
        "Product Series",
        "Model Name",
        "Model Title",
        "Machine Type",
        "Model Series",
        "Active",
        "Short Description",
        "SEO Description",
        "Full Description",
        "Specs",
        "Brochure",
    ]]
    for row in rows:
        product_model_rows.append([
            row.get("productOrder", ""),
            row.get("productName", ""),
            row.get("productDescription", ""),
            row.get("productSeries", ""),
            row.get("modelName", ""),
            row.get("modelTitle", ""),
            row.get("machineType", ""),
            row.get("series", ""),
            row.get("modelActive", ""),
            row.get("shortDescription", ""),
            row.get("seoDescription", ""),
            row.get("fullDescription", ""),
            row.get("specs", ""),
            row.get("brochure", ""),
        ])

    model_by_id = {model["id"]: model for model in data["models"]}
    product_by_id = {product["id"]: product for product in products}
    specs_rows = [[
        "Product Name",
        "Model Name",
        "Model Title",
        "Spec Order",
        "Spec Name",
        "Spec Value",
    ]]
    for spec in specs_long:
        model = model_by_id.get(spec.get("modelId"), {})
        product = product_by_id.get(spec.get("productId"), {})
        specs_rows.append([
            product.get("title", ""),
            spec.get("modelName", ""),
            model.get("modelTitle", ""),
            spec.get("specOrder", ""),
            spec.get("specName", ""),
            spec.get("specValue", ""),
        ])

    sheets = [
        ("Summary", summary_rows, [34, 110], False, False),
        ("Products", products_rows, [14, 12, 28, 12, 80, 38, 14], True, True),
        (
            "Product Models",
            product_model_rows,
            [12, 24, 54, 28, 20, 28, 18, 18, 12, 45, 45, 70, 56, 34],
            True,
            True,
        ),
        ("Specs Long", specs_rows, [28, 20, 28, 12, 30, 42], True, True),
    ]

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(OUTPUT, "w", ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types(len(sheets)))
        z.writestr("_rels/.rels", root_rels())
        z.writestr("xl/workbook.xml", workbook_xml([sheet[0] for sheet in sheets]))
        z.writestr("xl/_rels/workbook.xml.rels", workbook_rels([sheet[0] for sheet in sheets]))
        z.writestr("xl/styles.xml", styles_xml())
        z.writestr("docProps/core.xml", core_xml())
        z.writestr("docProps/app.xml", app_xml())
        for index, (_name, rows_data, widths, freeze, autofilter) in enumerate(sheets, start=1):
            z.writestr(
                f"xl/worksheets/sheet{index}.xml",
                worksheet_xml(rows_data, widths, freeze=freeze, autofilter=autofilter),
            )
    print(OUTPUT)


if __name__ == "__main__":
    build()
