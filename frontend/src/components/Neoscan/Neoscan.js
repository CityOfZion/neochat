import React from "react";
import { Row, Col, List } from "antd";
import { BigNumber } from "bignumber.js";
import PropTypes from "prop-types";

const Neoscan = ({ vin, vouts }) => {
  const renderItem = item => (
    <List.Item>
      <List.Item.Meta
        title={<a href={`https://neoscan.io/address/${item.address_hash}`}>{item.address_hash}</a>}
        description={BigNumber(item.value).toString() + item.asset}
      />
    </List.Item>
  );
  return (
    <Row>
      <Col span={12}>
        <List
          header={<div>From</div>}
          bordered={false}
          dataSource={vin}
          renderItem={item => (renderItem(item))}
        />
      </Col>
      <Col span={12}><List
        header={<div>To</div>}
        bordered={false}
        dataSource={vouts}
        renderItem={item => (renderItem(item))}
      />
      </Col>
    </Row>);
};

Neoscan.propTypes = {
  vin: PropTypes.array.isRequired,
  vouts: PropTypes.array.isRequired,
};

export default Neoscan;
