import express from "express";
import Joi from "joi";
import moment from "moment";
import axios from "axios";
import { Sequelize, Op } from "sequelize";
import sequelize from "../config/database.js";
import * as dotenv from "dotenv";
import { isWithinRadius } from "../utils/index.js";
dotenv.config();

import { msg } from "../utils/index.js";
import Absensi from "../models/Absensi.js";
import Jadwal from "../models/Jadwal.js";
import Lembur from "../models/Lembur.js";
import LokasiPenting from "../models/LokasiPenting.js";

const day = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

const getOverview = async (req, res) => {
  const nik = req.user.nik;

  const date = new Date();
  const today = date.toISOString().slice(0, 10);

  const absensi = await Absensi.findAll({
    where: {
      nik,
      status: 1,
      [Op.and]: [
        sequelize.where(
          sequelize.literal(`DATE(created_at) = '${today}'`),
          true
        ),
      ],
    },
    order: [["created_at", "ASC"]],
  });

  let jamMasuk = absensi.length == 0 ? null : absensi[0].created_at;
  let jamKeluar =
    absensi.length <= 1 ? null : absensi[absensi.length - 1].created_at;

  jamMasuk =
    jamMasuk != null
      ? moment.tz(jamMasuk, "Asia/Jakarta").utcOffset("+07:00")
      : "--:--";
  jamKeluar =
    jamKeluar != null
      ? moment.tz(jamKeluar, "Asia/Jakarta").utcOffset("+07:00")
      : "--:--";

  let jamKerja = null;
  if (jamMasuk != "--:--" && jamKeluar != "--:--") {
    const duration = moment.duration(jamKeluar.diff(jamMasuk));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    jamKerja = moment({ hour: hours, minute: minutes }).format("HH:mm");
  }

  if (jamMasuk != "--:--") jamMasuk = jamMasuk.format("HH:mm");
  if (jamKeluar != "--:--") jamKeluar = jamKeluar.format("HH:mm");

  const overview = {
    jamMasuk: jamMasuk,
    jamKeluar: jamKeluar,
    jamKerja: jamKerja != null ? jamKerja : "--:--",
  };

  return res.status(200).send({
    overview,
  });
};

const getRiwayatHarian = async (req, res) => {
  const nik = req.user.nik;

  const date = new Date();
  const today = date.toISOString().slice(0, 10);

  const absensi = await Absensi.findAll({
    where: {
      nik,
      [Op.and]: [
        sequelize.where(
          sequelize.literal(`DATE(created_at) = '${today}'`),
          true
        ),
      ],
    },
    order: [["created_at", "ASC"]],
    attributes: [["created_at", "jam"], "status"], //kurang alamat + kota
  });

  let formattedAbsensi = [];
  if (absensi.length > 0) {
    absensi.forEach((absen) => {
      formattedAbsensi.push({
        jam: moment(absen.dataValues.jam)
          .utcOffset("+07:00")
          .format("HH:mm:ss"),
        status: absen.dataValues.status,
      });
    });
  }

  return res.status(200).send({
    riwayat: formattedAbsensi,
  });
};

const getLaporanBulanan = async (req, res) => {
  const nik = req.user.nik;

  const now = new Date();
  const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const lastMonthYear =
    lastMonth === 12 ? now.getFullYear() - 1 : now.getFullYear();
  const startDate = new Date(lastMonthYear, lastMonth - 1, 26);
  const endDate = new Date(now.getFullYear(), now.getMonth(), 25);

  const absensi = await Absensi.findAll({
    attributes: [
      sequelize.literal(`DATE(created_at) AS date`),
      [sequelize.fn("MIN", sequelize.col("created_at")), "jam_masuk"],
      [sequelize.fn("MAX", sequelize.col("created_at")), "jam_keluar"],
    ],
    where: {
      nik,
      // status: 1,
      created_at: {
        [Op.between]: [startDate, endDate],
      },
      // [Op.and]: [
      //     sequelize.where(
      //         sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')),
      //         { [Op.not]: 1 }
      //     ),
      // ],
    },
    group: [sequelize.literal(`DATE(created_at)`)],
  });

  const retAbsensi = [];
  let hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  if (absensi.length > 0) {
    absensi.forEach((absen) => {
      let tempTgl = moment
        .tz(absen.dataValues.jam_masuk, "Asia/Jakarta")
        .utcOffset("+07:00")
        .format("DD MMM YYYY");
      let numHari = moment
        .tz(absen.dataValues.jam_masuk, "Asia/Jakarta")
        .utcOffset("+07:00")
        .day();
      let tempHari = hari[numHari];
      let tanggal = `${tempHari}, ${tempTgl}`;

      let jamMasuk = moment
        .tz(absen.dataValues.jam_masuk, "Asia/Jakarta")
        .utcOffset("+07:00");
      let jamKeluar = moment
        .tz(absen.dataValues.jam_keluar, "Asia/Jakarta")
        .utcOffset("+07:00");

      let jamKerja = "00:00";
      let jamKurang = "00:00";
      let jamLebih = "00:00";
      if (jamMasuk != "Invalid date" && jamKeluar != "Invalid date") {
        const duration = moment.duration(jamKeluar.diff(jamMasuk));
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();

        jamKerja = moment({ hour: hours, minute: minutes }).format("HH:mm");
        jamMasuk = jamMasuk.format("HH:mm");
        jamKeluar = jamKeluar.format("HH:mm");

        //count jam kurang
        if (numHari != 0 && hours < 7) {
          let kurang_jam = 7 - hours;
          let kurang_min = 60 - minutes;
          jamKurang = moment({ hour: kurang_jam, minute: kurang_min }).format(
            "HH:mm"
          );
          if (jamKurang == "Invalid date") jamKurang = "07:00";
        }

        //count jam lebih
        if (numHari != 0 && hours > 7) {
          let lebih_jam = hours - 7;
          jamLebih = moment({ hour: lebih_jam, minute: minutes }).format(
            "HH:mm"
          );
        } else if (numHari == 0) {
          jamLebih = jamKerja;
        }
      }

      retAbsensi.push({
        tanggal,
        absen_masuk: jamMasuk,
        absen_keluar: jamKeluar,
        jam_kerja: jamKerja,
        waktu_kurang: jamKurang,
        waktu_lebih: jamLebih,
      });
    });
  }

  return res.status(200).send({
    laporan: retAbsensi,
  });
};

const getLaporanKehadiran = async (req, res) => {
  const { tahun, bulan } = req.params;
  const nik = req.user.nik;

  const startDate = moment({ year: tahun, month: bulan - 1 })
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss");
  const endDate = moment({ year: tahun, month: bulan - 1 })
    .endOf("month")
    .format("YYYY-MM-DD HH:mm:ss");

  const absensi = await Absensi.findAll({
    attributes: [
      sequelize.literal(`DATE(created_at) AS date`),
      [sequelize.fn("MIN", sequelize.col("created_at")), "jam_masuk"],
      [sequelize.fn("MAX", sequelize.col("created_at")), "jam_keluar"],
    ],
    where: {
      nik,
      // status: 1,
      created_at: {
        [Op.between]: [startDate, endDate],
      },
      // [Op.and]: [
      //     sequelize.where(
      //         sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')),
      //         { [Op.not]: 1 }
      //     ),
      // ],
    },
    group: [sequelize.literal(`DATE(created_at)`)],
  });

  const retAbsensi = [];
  let hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  if (absensi.length > 0) {
    absensi.forEach((absen) => {
      let tempTgl = moment
        .tz(absen.dataValues.jam_masuk, "Asia/Jakarta")
        .utcOffset("+07:00")
        .format("DD MMM YYYY");
      let numHari = moment
        .tz(absen.dataValues.jam_masuk, "Asia/Jakarta")
        .utcOffset("+07:00")
        .day();
      let tempHari = hari[numHari];
      let tanggal = `${tempHari}, ${tempTgl}`;

      let jamMasuk = moment
        .tz(absen.dataValues.jam_masuk, "Asia/Jakarta")
        .utcOffset("+07:00");
      let jamKeluar = moment
        .tz(absen.dataValues.jam_keluar, "Asia/Jakarta")
        .utcOffset("+07:00");

      let jamKerja = "00:00";
      let jamKurang = "00:00";
      let jamLebih = "00:00";
      if (jamMasuk != "Invalid date" && jamKeluar != "Invalid date") {
        const duration = moment.duration(jamKeluar.diff(jamMasuk));
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();

        jamKerja = moment({ hour: hours, minute: minutes }).format("HH:mm");
        jamMasuk = jamMasuk.format("HH:mm");
        jamKeluar = jamKeluar.format("HH:mm");

        //count jam kurang
        if (numHari != 0 && hours < 7) {
          let kurang_jam = 7 - hours;
          let kurang_min = 60 - minutes;
          jamKurang = moment({ hour: kurang_jam, minute: kurang_min }).format(
            "HH:mm"
          );
          if (jamKurang == "Invalid date") jamKurang = "07:00";
        }

        //count jam lebih
        if (numHari != 0 && hours > 7) {
          let lebih_jam = hours - 7;
          jamLebih = moment({ hour: lebih_jam, minute: minutes }).format(
            "HH:mm"
          );
        } else if (numHari == 0) {
          jamLebih = jamKerja;
        }
      }

      retAbsensi.push({
        tanggal,
        absen_masuk: jamMasuk,
        absen_keluar: jamKeluar,
        jam_kerja: jamKerja,
        waktu_kurang: jamKurang,
        waktu_lebih: jamLebih,
      });
    });
  }

  return res.status(200).send({
    laporan: retAbsensi,
  });
};

const getLaporanChart = async (req, res) => {
  const { tahun, bulan } = req.params;
  const nik = req.user.nik;

  const startDate = moment({ year: tahun, month: bulan - 1 })
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss");
  const endDate = moment({ year: tahun, month: bulan - 1 })
    .endOf("month")
    .format("YYYY-MM-DD HH:mm:ss");

  const absensi = await Absensi.findAll({
    attributes: [
      sequelize.literal(`DATE(created_at) AS date`),
      [sequelize.fn("MIN", sequelize.col("created_at")), "jam_masuk"],
      [sequelize.fn("MAX", sequelize.col("created_at")), "jam_keluar"],
    ],
    where: {
      nik,
      status: 1,
      created_at: {
        [Op.between]: [startDate, endDate],
      },
      [Op.and]: [
        sequelize.where(
          sequelize.fn("DAYOFWEEK", Sequelize.col("created_at")),
          { [Op.not]: 1 }
        ),
      ],
    },
    group: [sequelize.literal(`DATE(created_at)`)],
  });

  const retAbsensi = [];
  const retLabels = [];
  if (absensi.length > 0) {
    absensi.forEach((absen) => {
      let tanggal = moment(absen.dataValues.jam_masuk).format("DD/MM/YYYY");

      let jamMasuk = moment(absen.dataValues.jam_masuk);
      let jamKeluar = moment(absen.dataValues.jam_keluar);

      let persentase = 0;
      if (jamMasuk != "Invalid date" && jamKeluar != "Invalid date") {
        const duration = moment.duration(jamKeluar.diff(jamMasuk));
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();

        let jamKerja = hours * 60 + minutes;
        persentase = ((jamKerja / 420) * 100).toFixed(2);
      }

      retAbsensi.push(parseFloat(persentase));
      retLabels.push(tanggal);
    });
  }

  return res.status(200).send({
    laporan: retAbsensi,
    labels: retLabels,
  });
};

const http = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested, Content-Type, Accept Authorization",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST",
  },
});

const addAbsensi = async (req, res) => {
  const nik = req.user.nik;
  const { is_lembur, keterangan, coord } = req.body;

  if (is_lembur && !keterangan) {
    return res.status(400).send(msg("Mohon isi keterangan lembur"));
  }

  let status = 0;
  //cek location valid gk
  let at = "";
  if (coord.lng != null && coord.lat != null) {
    at = `${coord.lat},${coord.lng}`;
  }
  console.log("Location:", at);
  const currentDay = day[new Date().getDay()];

  // get location name from jadwal
  const jadwal = await Jadwal.findOne({
    where: {
      nik: nik,
      hari: currentDay,
    },
  });
  if (jadwal) {
    const lokasi = await LokasiPenting.findByPk(jadwal.id_lokasi);
    // const lokasiAbsen = await http.get(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${at}&limit=10&lang=id&q=${lokasi.nama}&apiKey=${process.env.HERE_API_KEY}`)
    // if(lokasiAbsen.data.items.length > 0){
    //     status = lokasiAbsen.data.items[0].distance < 2000
    // }

    status = isWithinRadius(
      coord.lat,
      coord.lng,
      lokasi.latitude,
      lokasi.longitude,
      1
    );
  }

  if (currentDay == "MINGGU") {
    status = 1;
  }

  const absensi = await Absensi.create({
    nik: nik,
    longitude: coord.lng,
    latitude: coord.lat,
    is_lembur: is_lembur ? is_lembur : 0,
    keterangan: keterangan ? keterangan : "",
    status: status,
  });

  if (is_lembur) {
    const lembur = await Lembur.create({
      nik: nik,
      // id_absensi: absensi.id,
      status: 0,
    });
  }

  return res.status(201).send({
    data: absensi,
  });
};

export {
  getOverview,
  getRiwayatHarian,
  getLaporanBulanan,
  getLaporanKehadiran,
  getLaporanChart,
  addAbsensi,
};
