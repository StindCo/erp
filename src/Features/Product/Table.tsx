import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ChartMenuOptions, ColDef, SideBarDef } from "ag-grid-community";
import { updateProduct } from "../../shared/reducers/products";
import { createTask } from "../../shared/reducers/tasks";
import { useDispatch, useSelector } from "react-redux";
import { getConfs } from "../../shared/reducers/confs";
import { getWarehouses } from "../../shared/reducers/warehouses";
import { getProductCategories } from "../../shared/reducers/productCategories";
import { getFournisseurs } from "../../shared/reducers/fournisseurs";

type Props = {
  data: any;
  filterText: any;
};

const generateColumns = (ref: any, parentKey: any = null) => {
  if (ref == null) return [];
  let columns: ColDef[] = Object.keys(ref).map((key) => {
    if (typeof ref[key] == "object") {
      return {
        headerName: key,
        children: generateColumns(
          ref[key],
          parentKey == null ? key : parentKey + "." + key
        ),
      };
    } else {
      if (parentKey != null) return { field: parentKey + "." + key };
      return { field: key };
    }
  });
  return columns;
};

export default function Table({ data, filterText }: Props) {
  const gridRef = useRef<AgGridReact<any>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any>(data);
  const dispatch = useDispatch();
  let warehouses = useSelector(getWarehouses);
  let categories = useSelector(getProductCategories);
  let fournisseurs = useSelector(getFournisseurs);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>();
  const [taux, setTaux] = useState<any>(1);
  let confs = useSelector(getConfs);

  useEffect(() => {
    let tauxValue: any = confs.filter((value: any) => value?.tag == "taux")[0];
    setTaux(parseFloat(tauxValue?.valeur));
  }, [confs]);

  useEffect(() => {
    setColumnDefs([
      { field: "label", filter: "agTextColumnFilter" },
      { field: "description", filter: "agTextColumnFilter" },
      {
        field: "desiredStock",
        valueFormatter: (params) =>
          params?.value ? `${params.value} unités` : "",
        headerName: "stock optimal",
      },
      {
        field: "seuilAlerte",
        valueFormatter: (params) =>
          params?.value ? `${params.value} unités` : "",
      },

      {
        field: "margeBeneficiaire",
        valueFormatter: (params) => (params?.value ? `${params.value} %` : ""),
      },

      {
        field: "price",
        valueFormatter: (params) =>
          params?.value ? USDollar.format(params.value) : "",
        cellEditor: "agNumberCellEditor",
        cellEditorParams: {
          maxLength: 20,
        },
        editable: true,
        headerName: "Prix d'achat ($)",
        filter: "agNumberColumnFilter",
      },
      {
        valueGetter: (params: any) => {
          if (
            params.data?.price == null ||
            params.data?.margeBeneficiaire == null
          )
            return null;

          return (
            parseFloat(params.data?.price) +
            (parseFloat(params.data?.price) *
              parseFloat(params.data?.margeBeneficiaire)) /
              100
          ).toFixed(2);
        },
        valueFormatter: (params) =>
          params.value != null ? USDollar.format(params.value) : "",
        cellEditor: "agNumberCellEditor",
        cellEditorParams: {
          maxLength: 20,
        },
        editable: false,
        headerName: "Prix de vente ($)",
        filter: "agNumberColumnFilter",
        cellClass: "bg-orange-200",
      },
      {
        valueGetter: (params: any) => {
          if (
            params.data?.price == null ||
            params.data?.margeBeneficiaire == null
          )
            return null;
          return (
            (parseFloat(params.data?.price) +
              (parseFloat(params.data?.price) *
                parseFloat(params.data?.margeBeneficiaire)) /
                100) *
            taux
          ).toFixed(2);
        },
        valueFormatter: (params) =>
          params.value != null ? CDF_FORMAT.format(params.value) : "",
        cellEditor: "agNumberCellEditor",
        cellClass: "bg-slate-600 text-white font-[PoppinsBold]",
        cellEditorParams: {
          maxLength: 20,
        },
        editable: false,
        headerName: "Prix de vente (FC)",
        filter: "agNumberColumnFilter",
      },
      {
        field: "warehouse.name",
        headerName: "Entrepôt",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [
            "",
            ...warehouses.map(
              (value: any) => value?.name + "-" + value?.idTech
            ),
          ],
        },
        filter: "agTextColumnFilter",
      },
      {
        field: "category.label",
        headerName: "Catégorie",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [
            "",
            ...categories.map(
              (value: any) => value?.label + "-" + value?.idTech
            ),
          ],
        },
        filter: "agTextColumnFilter",
      },
      {
        field: "fournisseur.name",
        headerName: "Fournisseur",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [
            "",
            ...fournisseurs.map(
              (value: any) => value?.name + "-" + value?.idTech
            ),
          ],
        },
        filter: "agTextColumnFilter",
      },
      { field: "createdAt", editable: false },
    ]);
  }, [taux]);

  let USDollar = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
  });

  let CDF_FORMAT = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "CDF",
  });

  const saveNewValue = (params: any) => {
    let field = params.column.colId;
    let newRow = { ...params.data };
    newRow[field] = params.newValue;

    newRow["desiredStock"] = parseInt(newRow["desiredStock"]);
    newRow["seuilAlerte"] = parseInt(newRow["seuilAlerte"]);
    newRow["price"] = parseFloat(newRow["price"]);
    newRow["margeBeneficiaire"] = parseFloat(newRow["margeBeneficiaire"]);

    console.log(params);

    if (newRow["warehouse.name"] != null) {
      newRow["warehouse"] =
        warehouses.filter((value: any) =>
          newRow["warehouse.name"].includes(value?.idTech)
        )[0] ?? newRow["warehouse"];
    }

    if (newRow["fournisseur.name"] != null) {
      newRow["fournisseur"] =
        fournisseurs.filter((value: any) =>
          newRow["fournisseur.name"].includes(value?.idTech)
        )[0] ?? newRow["fournisseur"];
    }

    if (newRow["category.label"] != null) {
      newRow["category"] =
        categories.filter((value: any) =>
          newRow["category.label"].includes(value?.idTech)
        )[0] ?? newRow["category"];
    }

    dispatch(updateProduct({ product: newRow }));
    dispatch(
      createTask({
        task: {
          endpoint: "/products/" + newRow?.idTech,
          method: "PUT",
          data: newRow,
          params: {},
        },
      })
    );
  };

  useEffect(() => {
    setRowData(data);

    if (data != null && data.length != 0) {
      let firstRow = data[0];
      let columns = generateColumns(firstRow);

      setColumnDefs([
        { field: "label", filter: "agTextColumnFilter" },
        { field: "description", filter: "agTextColumnFilter" },
        {
          field: "desiredStock",
          valueFormatter: (params) =>
            params?.value ? `${params.value} unités` : "",
          headerName: "stock optimal",
        },
        {
          field: "seuilAlerte",
          valueFormatter: (params) =>
            params?.value ? `${params.value} unités` : "",
        },

        {
          field: "margeBeneficiaire",
          valueFormatter: (params) =>
            params?.value ? `${params.value} %` : "",
        },

        {
          field: "price",
          valueFormatter: (params) =>
            params?.value ? USDollar.format(params.value) : "",
          cellEditor: "agNumberCellEditor",
          cellEditorParams: {
            maxLength: 20,
          },
          editable: true,
          headerName: "Prix d'achat ($)",
          filter: "agNumberColumnFilter",
        },
        {
          valueGetter: (params: any) => {
            if (
              params.data?.price == null ||
              params.data?.margeBeneficiaire == null
            )
              return null;

            return (
              parseFloat(params.data?.price) +
              (parseFloat(params.data?.price) *
                parseFloat(params.data?.margeBeneficiaire)) /
                100
            ).toFixed(2);
          },
          valueFormatter: (params) =>
            params.value != null ? USDollar.format(params.value) : "",
          cellEditor: "agNumberCellEditor",
          cellEditorParams: {
            maxLength: 20,
          },
          editable: false,
          headerName: "Prix de vente ($)",
          filter: "agNumberColumnFilter",
          aggFunc: "sum",
          cellClass: "bg-orange-200",
        },
        {
          valueGetter: (params: any) => {
            if (
              params.data?.price == null ||
              params.data?.margeBeneficiaire == null
            )
              return null;
            return (
              (parseFloat(params.data?.price) +
                (parseFloat(params.data?.price) *
                  parseFloat(params.data?.margeBeneficiaire)) /
                  100) *
              taux
            ).toFixed(2);
          },
          valueFormatter: (params) =>
            params.value != null ? CDF_FORMAT.format(params.value) : "",
          cellEditor: "agNumberCellEditor",
          aggFunc: "sum",
          cellClass: "bg-slate-600 text-white font-[PoppinsBold]",
          cellEditorParams: {
            maxLength: 20,
          },
          editable: false,
          headerName: "Prix de vente (FC)",
          filter: "agNumberColumnFilter",
        },
        {
          field: "warehouse.name",
          headerName: "Entrepôt",
          editable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [
              "",
              ...warehouses.map(
                (value: any) => value?.name + "-" + value?.idTech
              ),
            ],
          },
          filter: "agTextColumnFilter",
        },
        {
          field: "category.label",
          headerName: "Catégorie",
          editable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [
              "",
              ...categories.map(
                (value: any) => value?.label + "-" + value?.idTech
              ),
            ],
          },
          filter: "agTextColumnFilter",
        },
        {
          field: "fournisseur.name",
          headerName: "Fournisseur",
          editable: true,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: [
              "",
              ...fournisseurs.map(
                (value: any) => value?.name + "-" + value?.idTech
              ),
            ],
          },
          filter: "agTextColumnFilter",
        },
        { field: "createdAt", editable: false },
      ]);
    } else {
      setColumnDefs([]);
    }
  }, [data]);

  const defaultColDef = useMemo<any>(() => {
    return {
      sortable: true,
      resizable: true,
      editable: true,
      valueSetter: saveNewValue,
      enableRowGroup: true,
      enableValue: true,
      pivot: true,
    };
  }, []);
  const sideBar = useMemo<
    SideBarDef | string | string[] | boolean | null
  >(() => {
    return {
      toolPanels: ["columns", "filters"],
    };
  }, []);

  const getChartToolbarItems = useCallback((): ChartMenuOptions[] => {
    return ["chartDownload", "chartUnlink"];
  }, []);

  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);

  return (
    <div className="h-[300px] w-full">
      <div style={containerStyle}>
        <div className="flex flex-col h-full w-full">
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact<any>
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              quickFilterText={filterText}
              defaultColDef={defaultColDef}
              paginationPageSize={10}
              sideBar={sideBar}
              enableCharts={true}
              pagination={true}
              popupParent={popupParent}
              enableRangeSelection={true}
              getChartToolbarItems={getChartToolbarItems}
              rowGroupPanelShow={"always"}
              pivotPanelShow={"always"}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
}
