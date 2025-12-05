import React, { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import "./MapChart.css"

const geoUrl = "/ne_10m_land.geojson";
const warningJsonURL = "https://raw.githubusercontent.com/G-Yonathan/travel-warning-map/refs/heads/master/scraper/clean.json";

export default function MapChart({ onTimestamp, onMissingCountries }) {
    const { t, i18n } = useTranslation();
    const [dataMap, setDataMap] = useState(null);
    const [geoData, setGeoData] = useState(null)
    const [colors, setColors] = useState({});

    useEffect(() => {
        fetch(warningJsonURL)
            .then((res) => res.json())
            .then(jsonData => {
                setDataMap(jsonData.countries);
                if (onTimestamp) onTimestamp(jsonData.timestamp);
            })
            .catch((err) => console.error("Failed to load warning json", err))
    }, []);

    useEffect(() => {
        fetch(geoUrl)
            .then((res) => res.json())
            .then((data) => {
                setGeoData(data);
            })
            .catch((err) => console.error("Failed to load geo json", err));
    }, []);

    useEffect(() => {
        if (!dataMap || !geoData) return;
        const mapFeatures = geoData.objects.world.geometries;

        const missing = Object.keys(dataMap).filter(code =>
            !mapFeatures.some(geo => geo.id === code)
        );

        if (onMissingCountries) {
            onMissingCountries(missing.map(code => ({
                code,
                ...dataMap[code]
            })));
        }
    }, [dataMap, geoData])

    useEffect(() => {
        const s = getComputedStyle(document.documentElement)
        setColors({
            1: s.getPropertyValue("--level-1").trim(),
            2: s.getPropertyValue("--level-2").trim(),
            3: s.getPropertyValue("--level-3").trim(),
            4: s.getPropertyValue("--level-4").trim(),
        })
    }, [])

    const generatePatterns = () => {
        const patterns = [];
        const levelCombinations = [
            [1], [2], [3], [4],
            [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4],
            [1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4],
            [1, 2, 3, 4],
        ];

        levelCombinations.forEach((levels) => {
            const id = `pattern-${levels.join("-")}`;
            const num = levels.length;
            patterns.push(
                <pattern
                    key={id}
                    id={id}
                    width={num === 1 ? 1 : 4}
                    height={num === 1 ? 1 : 4}
                    patternUnits="userSpaceOnUse"
                    patternTransform={num > 1 ? "rotate(45)" : undefined}
                >
                    {levels.map((level, index) => (
                        <rect
                            key={index}
                            x={index * (4 / num)}
                            y={0}
                            width={4 / num}
                            height={4}
                            fill={colors[level]}
                        />
                    ))}
                </pattern>
            );
        });

        return patterns;
    };

    if (!dataMap) return null;

    return (
        <div className="mapchart-wrapper">
            <svg width="0" height="0">
                <defs>{generatePatterns()}</defs>
            </svg>
            <ComposableMap
                projectionConfig={{
                    scale: 230,
                    center: [13, 5],
                }}
                className="map-component"
            >
                <ZoomableGroup>
                    <Geographies geography={geoData}>
                        {({ geographies }) => {
                            return geographies.map((geo) => {
                                const levels = dataMap[geo.id]?.WarningLevels || [];
                                const sortedLevels = [...levels].sort((a, b) => a - b);
                                const patternId = sortedLevels.length
                                    ? `url(#pattern-${sortedLevels.join("-")})`
                                    : "#D6D6DA";

                                const url = dataMap[geo.id]?.URL

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        style={{
                                            default: { fill: patternId },
                                            hover: { fill: patternId, opacity: 0.7, cursor: url ? 'pointer' : 'default' },
                                            pressed: { fill: patternId },
                                        }}
                                        onClick={() => {
                                            if (url) {
                                                window.open(url, "_blank", "noopener,noreferrer");
                                            }
                                        }}
                                        data-tooltip-id="country-tooltip"
                                        data-tooltip-html={dataMap[geo.id] && `
                                                            <div dir="${i18n.language === 'he' ? 'rtl' : 'ltr'}">
                                                                <h3>${i18n.language === 'he' ? dataMap[geo.id]?.HebrewName : dataMap[geo.id]?.EnglishName}</h3>
                                                                <p>${dataMap[geo.id]?.Details}</p>
                                                            </div>
                                                          `}
                                    />
                                )
                            })
                        }
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            <Tooltip
                id="country-tooltip"
                float
            />

        </div>
    )
}
