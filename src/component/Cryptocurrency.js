import React, { useState, useEffect } from "react";
import axios from "axios";

const Cryptocurrency = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    setInterval(() => {
      axios
        .get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        )
        .then((res) => {
          setCoins(res.data);
        });
    }, 1500);
  }, []);
  const control = (e) => {
    if (e !== [] && e < 0) {
      return <td className="red">{e.toFixed(2)}%</td>;
    } else if (e !== [] && e > 0) {
      return <td className="green">{e.toFixed(2)}%</td>;
    } else {
      return <td>null</td>;
    }
  };
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Image</th>
            <th>Crypto Name</th>
            <th>Current price</th>
            <th>Price change 24h</th>
            <th>Market cap </th>
          </tr>
        </thead>
        {coins.map((coin) => {
          return (
            <tbody key={coin.id}>
              <tr>
                <td>{coin.market_cap_rank}</td>
                <td>
                  <img
                    className="cryptoImage"
                    src={coin.image}
                    alt="crypto image"
                  />
                </td>
                <td>
                  {coin.name} ({coin.symbol.toLowerCase()})
                </td>
                {coin.price_change_percentage_24h < 0 ? (
                  <td className="red">
                    {coin.current_price.toLocaleString()}$
                  </td>
                ) : (
                  <td className="green">
                    {coin.current_price.toLocaleString()}$
                  </td>
                )}
                {control(coin.price_change_percentage_24h)}
                <td>{coin.market_cap.toLocaleString()}$</td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};
export default Cryptocurrency;
