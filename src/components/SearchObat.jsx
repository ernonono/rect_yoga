import React, { useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import axios from "axios";
function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        console.log(newOptions);
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

// Usage of DebounceSelect

async function fetchProducts(value) {
  if (!value) {
    return [];
  }

  const parseValue = value?.split(" ")?.join("+");

  const url = `https://api.fda.gov/drug/ndc.json?search=brand_name:${parseValue}+product_ndc:${parseValue}&limit=10`;
  return axios
    .get(url)
    .then((response) => {
      return response.data.results.map((item) => ({
        label: `${item?.brand_name || item.generic_name} (${item.product_ndc})`,
        value: `${item?.brand_name || item.generic_name}|${item.product_ndc}`,
      }));
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

const extractFromBrackets = (str) => {
  const matches = str.match(/\(([^)]+)\)/);
  return matches ? matches[1] : "";
};

const nonBrackets = (str) => {
  return str.replace(/\(([^)]+)\)/, "").trim();
};

const SearchObat = ({ form }) => {
  const [value, setValue] = useState([]);
  return (
    <DebounceSelect
      mode="tags"
      form={form}
      value={value}
      placeholder="Cari kode obat"
      fetchOptions={fetchProducts}
      onChange={(newValue) => {
        setValue(newValue);
        console.log(newValue);
        form.setFieldsValue({
          drug_code: newValue?.map((item) => {
            const name = item?.value?.split("|")[0] || nonBrackets(item?.value);
            const code =
              item?.value?.split("|")[1] || extractFromBrackets(item?.value);

            return {
              name,
              code,
            };
          }),
        });
      }}
      style={{
        width: "100%",
      }}
    />
  );
};
export default SearchObat;
