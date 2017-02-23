<?php

$curl = curl_init(buildUrl($_GET['lat'], $_GET['lon']));

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($curl);
header('Content-Type: application/json');
echo $result;

function buildUrl($lat, $lon){
    $key = "5fa4fa780f6ff9c62c4cddc893b52a91";
    return 'http://api.openweathermap.org/data/2.5/forecast?lat='
    . $lat . '&lon='
    . $lon . '&cnt=16&units=metric&lang=fr&APPID=' . $key;
    }
