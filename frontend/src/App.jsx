import { useState, useEffect } from "react";
import "./App.css";

import {
  calculateRainwater,
  calculateCommunity,
  analyzeHeat,
  getCurrentWeather,
  getClimateStatus,
} from "./api";

function App() {
  const [mode, setMode] = useState("water");

  const [weather, setWeather] = useState(null);
  const [climateStatus, setClimateStatus] = useState(null);

  const [waterInput, setWaterInput] = useState({
    roof_area: 100,
    rainfall_mm: 50,
    tank_capacity: 3000,
  });

  const [waterResult, setWaterResult] = useState(null);
  const [waterReadiness, setWaterReadiness] = useState(null);

  const [communityInput, setCommunityInput] = useState({
    current_water: 60000,
    tank_capacity: 100000,
    incoming_water: 30000,
  });

  const [communityResult, setCommunityResult] = useState(null);

  const [heatInput, setHeatInput] = useState({
    temperature: 43,
    humidity: 55,
    tree_cover: 10,
    built_up: 80,
  });

  const [heatResult, setHeatResult] = useState(null);

  // -------------------------
  // LOAD CLIMATE STATUS
  // -------------------------

  useEffect(() => {
    const loadClimateStatus = async () => {
      try {
        const result = await getClimateStatus({
          tree_cover: 10,
          built_up: 80,
        });

        setClimateStatus(result);
      } catch (error) {
        console.error("Climate status error:", error);
      }
    };

    loadClimateStatus();
  }, []);

  // -------------------------
  // LOAD WEATHER
  // -------------------------

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await getCurrentWeather();
        setWeather(data);
      } catch (error) {
        console.error("Weather error:", error);
      }
    };

    loadWeather();
  }, []);

  // -------------------------
  // HOUSEHOLD WATER
  // -------------------------

  const handleWater = async () => {
    try {
      const result = await calculateRainwater(waterInput);
      setWaterResult(result);
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // COMMUNITY WATER
  // -------------------------

  const handleCommunity = async () => {
    try {
      const result = await calculateCommunity(communityInput);

      setCommunityResult(result);

      // Water readiness calculation
      const fillPercentage =
        (communityInput.current_water /
          communityInput.tank_capacity) *
        100;

      const availableSpace = Math.max(
        communityInput.tank_capacity -
          communityInput.current_water,
        0
      );

      let status = "READY";
      let message =
        "Community storage has sufficient available capacity.";

      if (fillPercentage >= 90) {
        status = "HIGH RISK";
        message =
          "Tank is nearly full. Prepare a safe overflow route.";
      } else if (fillPercentage >= 70) {
        status = "WATCH";
        message =
          "Storage is getting high. Prioritize available storage.";
      }

      if (communityInput.incoming_water > availableSpace) {
        status = "HIGH RISK";
        message =
          "Incoming water exceeds available storage capacity.";
      }

      setWaterReadiness({
        fill_percentage: Number(
          fillPercentage.toFixed(1)
        ),
        available_space: availableSpace,
        incoming_water: communityInput.incoming_water,
        status,
        message,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // HEAT
  // -------------------------

  const handleHeat = async () => {
    try {
      const result = await analyzeHeat(heatInput);
      setHeatResult(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">

      {/* HEADER */}

      <header className="hero">
        <div>
          <div className="brand">
            🌍 ClimateShield
          </div>

          <h1>
            Building cities that are
            <span> ready for extreme weather.</span>
          </h1>

          <p>
            A practical resilience platform helping
            communities manage extreme heat and
            monsoon water challenges.
          </p>
        </div>

        <div className="location-badge">
          📍 Kanpur, India
        </div>
      </header>

      {/* MODE SWITCH */}

      <nav className="mode-switch">

        <button
          className={
            mode === "water" ? "active" : ""
          }
          onClick={() => setMode("water")}
        >
          🌧️ RainBank
        </button>

        <button
          className={
            mode === "heat" ? "active" : ""
          }
          onClick={() => setMode("heat")}
        >
          ☀️ CoolSpot
        </button>

      </nav>

      <main>

        {/* DASHBOARD */}

        <section className="dashboard">

          <div className="stat-card">

            <div className="stat-icon">
              🌡️
            </div>

            <div>
              <p>Temperature</p>

              <h3>
                {climateStatus
                  ? `${climateStatus.weather.temperature_c}°C`
                  : "Loading..."}
              </h3>

              <span>
                Humidity:{" "}
                {climateStatus
                  ? `${climateStatus.weather.humidity_percent}%`
                  : "--"}
              </span>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🔥
            </div>

            <div>
              <p>Heat Risk</p>

              <h3>
                {climateStatus
                  ? climateStatus.heat.risk
                  : "Loading..."}
              </h3>

              <span>
                Score:{" "}
                {climateStatus
                  ? `${climateStatus.heat.score}/100`
                  : "--"}
              </span>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🌧️
            </div>

            <div>
              <p>Rain Risk</p>

              <h3>
                {climateStatus
                  ? climateStatus.rain.risk
                  : "Loading..."}
              </h3>

              <span>
                Rainfall:{" "}
                {climateStatus
                  ? `${climateStatus.weather.rain_mm} mm`
                  : "--"}
              </span>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📊
            </div>

            <div>
              <p>Climate Readiness</p>

              <h3>
                {climateStatus
                  ? `${climateStatus.climate_readiness.score}/100`
                  : "Loading..."}
              </h3>

              <span>
                {climateStatus
                  ? climateStatus.climate_readiness.status
                  : "Calculating..."}
              </span>
            </div>

          </div>

        </section>


        {/* CLIMATE ACTIONS */}

        {climateStatus && (
          <section className="action-panel">

            <div>

              <span className="eyebrow">
                CLIMATE PRIORITIES
              </span>

              <h2>
                What should this community do next?
              </h2>

              <p>
                ClimateShield converts live environmental
                conditions into practical resilience actions.
              </p>

            </div>

            <div className="action-list">

              {climateStatus.actions.map(
                (action, index) => (
                  <div
                    className="action-item"
                    key={index}
                  >
                    <span>✓</span>
                    <strong>{action}</strong>
                  </div>
                )
              )}

            </div>

          </section>
        )}


        {/* ========================= */}
        {/* RAINBANK */}
        {/* ========================= */}

        {mode === "water" && (
          <>

            <section className="section-heading">

              <div>

                <span className="eyebrow">
                  RAINBANK
                </span>

                <h2>
                  Turn heavy rain into a water resource.
                </h2>

                <p>
                  Estimate rooftop rainwater collection
                  and manage excess water before it
                  becomes runoff or flooding.
                </p>

              </div>

            </section>


            <section className="grid">

              {/* HOUSEHOLD */}

              <div className="panel">

                <div className="panel-header">

                  <div>

                    <span className="panel-icon">
                      🏠
                    </span>

                    <h3>
                      Household Rainwater
                    </h3>

                  </div>

                </div>


                <label>
                  Roof area (m²)
                </label>

                <input
                  type="number"
                  value={waterInput.roof_area}
                  onChange={(e) =>
                    setWaterInput({
                      ...waterInput,
                      roof_area:
                        Number(e.target.value),
                    })
                  }
                />


                <label>
                  Expected rainfall (mm)
                </label>

                <input
                  type="number"
                  value={waterInput.rainfall_mm}
                  onChange={(e) =>
                    setWaterInput({
                      ...waterInput,
                      rainfall_mm:
                        Number(e.target.value),
                    })
                  }
                />


                <label>
                  Tank capacity (litres)
                </label>

                <input
                  type="number"
                  value={waterInput.tank_capacity}
                  onChange={(e) =>
                    setWaterInput({
                      ...waterInput,
                      tank_capacity:
                        Number(e.target.value),
                    })
                  }
                />


                <button
                  className="primary-button"
                  onClick={handleWater}
                >
                  Calculate Collection →
                </button>


                {waterResult && (
                  <div className="result-box">

                    <div className="result-row">
                      <span>
                        Potential collection
                      </span>

                      <strong>
                        {
                          waterResult.potential_collection_liters
                        }{" "}
                        L
                      </strong>
                    </div>


                    <div className="result-row">
                      <span>
                        Stored at home
                      </span>

                      <strong>
                        {
                          waterResult.stored_liters
                        }{" "}
                        L
                      </strong>
                    </div>


                    <div className="result-row">
                      <span>
                        Overflow
                      </span>

                      <strong>
                        {
                          waterResult.overflow_liters
                        }{" "}
                        L
                      </strong>
                    </div>


                    <div className="recommendation">
                      💡{" "}
                      {waterResult.recommendation}
                    </div>

                  </div>
                )}

              </div>


              {/* COMMUNITY STORAGE */}

              <div className="panel">

                <div className="panel-header">

                  <div>

                    <span className="panel-icon">
                      🏘️
                    </span>

                    <h3>
                      Community Storage
                    </h3>

                  </div>

                </div>


                <label>
                  Current water (litres)
                </label>

                <input
                  type="number"
                  value={communityInput.current_water}
                  onChange={(e) =>
                    setCommunityInput({
                      ...communityInput,
                      current_water:
                        Number(e.target.value),
                    })
                  }
                />


                <label>
                  Tank capacity (litres)
                </label>

                <input
                  type="number"
                  value={communityInput.tank_capacity}
                  onChange={(e) =>
                    setCommunityInput({
                      ...communityInput,
                      tank_capacity:
                        Number(e.target.value),
                    })
                  }
                />


                <label>
                  Incoming water (litres)
                </label>

                <input
                  type="number"
                  value={communityInput.incoming_water}
                  onChange={(e) =>
                    setCommunityInput({
                      ...communityInput,
                      incoming_water:
                        Number(e.target.value),
                    })
                  }
                />


                <button
                  className="primary-button"
                  onClick={handleCommunity}
                >
                  Update Storage →
                </button>


                {communityResult && (
                  <div className="result-box">

                    <div className="result-row">

                      <span>
                        Current level
                      </span>

                      <strong>
                        {
                          communityResult.current_water_liters
                        }{" "}
                        L
                      </strong>

                    </div>


                    <div className="result-row">

                      <span>
                        Tank fill
                      </span>

                      <strong>
                        {
                          communityResult.fill_percentage
                        }%
                      </strong>

                    </div>


                    <div className="result-row">

                      <span>
                        Overflow
                      </span>

                      <strong>
                        {
                          communityResult.overflow_liters
                        }{" "}
                        L
                      </strong>

                    </div>


                    <div className="recommendation">
                      💡{" "}
                      {communityResult.recommendation}
                    </div>

                  </div>
                )}

              </div>

            </section>


            {/* WATER READINESS */}

            {waterReadiness && (
              <section className="water-readiness">

                <div>

                  <span className="eyebrow">
                    WATER READINESS
                  </span>

                  <h3>
                    💧 Community Storage:{" "}
                    {waterReadiness.status}
                  </h3>

                  <p>
                    {waterReadiness.message}
                  </p>

                </div>


                <div className="water-metrics">

                  <div>

                    <span>
                      Tank filled
                    </span>

                    <strong>
                      {
                        waterReadiness.fill_percentage
                      }%
                    </strong>

                  </div>


                  <div>

                    <span>
                      Available space
                    </span>

                    <strong>
                      {
                        waterReadiness.available_space
                      }{" "}
                      L
                    </strong>

                  </div>


                  <div>

                    <span>
                      Incoming water
                    </span>

                    <strong>
                      {
                        waterReadiness.incoming_water
                      }{" "}
                      L
                    </strong>

                  </div>

                </div>

              </section>
            )}

          </>
        )}


        {/* ========================= */}
        {/* COOLSPOT */}
        {/* ========================= */}

        {mode === "heat" && (
          <>

            <section className="section-heading">

              <div>

                <span className="eyebrow">
                  COOLSPOT
                </span>

                <h2>
                  Identify heat exposure before
                  it becomes dangerous.
                </h2>

                <p>
                  Assess local heat conditions and
                  identify practical interventions
                  such as shade, trees and cool roofs.
                </p>

              </div>

            </section>


            <section className="grid">

              <div className="panel">

                <div className="panel-header">

                  <div>

                    <span className="panel-icon">
                      ☀️
                    </span>

                    <h3>
                      Heat Risk Analysis
                    </h3>

                  </div>

                </div>


                <label>
                  Temperature (°C)
                </label>

                <input
                  type="number"
                  value={heatInput.temperature}
                  onChange={(e) =>
                    setHeatInput({
                      ...heatInput,
                      temperature:
                        Number(e.target.value),
                    })
                  }
                />


                <label>
                  Humidity (%)
                </label>

                <input
                  type="number"
                  value={heatInput.humidity}
                  onChange={(e) =>
                    setHeatInput({
                      ...heatInput,
                      humidity:
                        Number(e.target.value),
                    })
                  }
                />


                <label>
                  Tree cover (%)
                </label>

                <input
                  type="number"
                  value={heatInput.tree_cover}
                  onChange={(e) =>
                    setHeatInput({
                      ...heatInput,
                      tree_cover:
                        Number(e.target.value),
                    })
                  }
                />


                <label>
                  Built-up area (%)
                </label>

                <input
                  type="number"
                  value={heatInput.built_up}
                  onChange={(e) =>
                    setHeatInput({
                      ...heatInput,
                      built_up:
                        Number(e.target.value),
                    })
                  }
                />


                <button
                  className="primary-button"
                  onClick={handleHeat}
                >
                  Analyze Heat Risk →
                </button>


                {heatResult && (
                  <div className="result-box">

                    <div className="heat-score">

                      <span>
                        Heat Risk Score
                      </span>

                      <strong>
                        {heatResult.heat_risk_score}
                        <small>/100</small>
                      </strong>

                    </div>


                    <div className="risk-level">

                      Risk level:{" "}
                      <strong>
                        {heatResult.risk_level}
                      </strong>

                    </div>


                    <h4>
                      Recommended actions
                    </h4>


                    <ul>

                      {heatResult.recommendations.map(
                        (item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        )
                      )}

                    </ul>

                  </div>
                )}

              </div>


              <div className="impact-panel">

                <span className="eyebrow">
                  WHY IT MATTERS
                </span>

                <h3>
                  Heat resilience is about
                  reducing exposure.
                </h3>


                <div className="impact-item">

                  <span>🌳</span>

                  <div>

                    <strong>
                      More shade
                    </strong>

                    <p>
                      Trees and shaded public
                      spaces reduce direct heat
                      exposure.
                    </p>

                  </div>

                </div>


                <div className="impact-item">

                  <span>🏠</span>

                  <div>

                    <strong>
                      Cooler buildings
                    </strong>

                    <p>
                      Reflective and cool roofs
                      can reduce indoor heat
                      accumulation.
                    </p>

                  </div>

                </div>


                <div className="impact-item">

                  <span>💧</span>

                  <div>

                    <strong>
                      Hydration access
                    </strong>

                    <p>
                      Heat alerts can help
                      communities prepare water
                      and hydration points.
                    </p>

                  </div>

                </div>

              </div>

            </section>

          </>
        )}


        {/* FOOTER */}

        <footer>

          <strong>
            ClimateShield
          </strong>

          <span>
            Heat resilience + water resilience
            for Indian cities.
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;