import { Button, Modal, Table } from "antd";
import { useState, useEffect } from "react";

import { polyData } from "../data/ula_all";

const columns = [
  {
    title: "Population",
    dataIndex: "Population",
    key: "Population",
  },
  {
    title: "Total Outlets",
    dataIndex: "Total Outlets",
    key: "Total Outlets",
  },
  {
    title: "Address",
    dataIndex: "Address",
    key: "Address",
  },
];
const PolygonDetailsModal = ({
  polygonModalFalag,
  setPolygonModalFalag,
  selectedPolygonId,
}) => {
  const [loadind, setLoadind] = useState(true);
  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setLoadind(true);
    let locations = polyData?.nairobi?.locations;
    let locationKeys = Object.keys(locations);
    let index = locationKeys.indexOf(selectedPolygonId);
    let tempData = locations[locationKeys[index]];
    setData({
      address: tempData?.data?.address,
      population: tempData?.data?.population,
      totalOutlets: tempData?.data?.totalOutlets,
    });
    setTableData([
      {
        key: "1",
        Address: data?.address,
        Population: data?.population,
        "Total Outlets": data?.totalOutlets,
      },
    ]);
    console.log("tableData", tableData);
    setLoadind(false);
  }, []);
  return (
    <div>
      <Modal
        title={`${selectedPolygonId} Details`}
        centered
        open={polygonModalFalag}
        onOk={() => setPolygonModalFalag(false)}
        onCancel={() => setPolygonModalFalag(false)}
        width={1000}
        footer={null}
      >
        {loadind ? (
          <div>
            <p>loading Details {selectedPolygonId}</p>
          </div>
        ) : (
          <div>
            {loadind ? (
              <p className="text-center">
                loading Details.. {selectedPolygonId}
              </p>
            ) : (
              <Table
                dataSource={[
                  {
                    key: "1",
                    Address: data?.address,
                    Population: data?.population,
                    "Total Outlets": data?.totalOutlets,
                  },
                ]}
                columns={columns}
                // remove pagination
                pagination={false}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default PolygonDetailsModal;
