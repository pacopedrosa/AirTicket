-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-05-2025 a las 20:06:12
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vueling`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `extra`
--

CREATE TABLE `extra` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `extra`
--

INSERT INTO `extra` (`id`, `description`, `price`) VALUES
(1, 'Equipaje adicional 23kg', 30),
(2, 'Selección de asiento', 10),
(3, 'Comida a bordo', 15),
(4, 'Maleta adicional 10kg', 20),
(5, 'Prioridad de embarque', 12),
(6, 'Asiento con más espacio', 25),
(7, 'Seguro de viaje', 18),
(8, 'Acceso a sala VIP', 40),
(9, 'Cambio de vuelo flexible', 30),
(10, 'Menú gourmet a bordo', 22),
(11, 'Equipaje especial (bicicleta)', 50),
(12, 'Mascota en cabina', 45),
(13, 'Wi-Fi a bordo', 10),
(14, 'Bebida premium', 8),
(15, 'Transporte al aeropuerto', 35),
(16, 'Check-in prioritario', 15),
(17, 'Auriculares de alta calidad', 5),
(18, 'Almohada y manta', 7),
(19, 'Asiento en ventana', 12),
(20, 'Asiento en pasillo', 10),
(21, 'Reserva de asiento para grupo', 20),
(22, 'Extra de equipaje de mano', 15),
(23, 'Servicio de entretenimiento premium', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `extra_reservation`
--

CREATE TABLE `extra_reservation` (
  `id` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `extra_reservation`
--

INSERT INTO `extra_reservation` (`id`, `amount`) VALUES
(1, 40),
(2, 25),
(3, 50),
(4, 35),
(5, 60),
(6, 25),
(7, 45),
(8, 30),
(9, 55),
(10, 20),
(11, 100),
(12, 20),
(13, 40),
(14, 105),
(15, 20),
(16, 60),
(17, 60),
(18, 50),
(19, 90),
(20, 60),
(21, 44),
(22, 60),
(23, 70),
(24, 60);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `extra_reservation_extra`
--

CREATE TABLE `extra_reservation_extra` (
  `extra_reservation_id` int(11) NOT NULL,
  `extra_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `extra_reservation_extra`
--

INSERT INTO `extra_reservation_extra` (`extra_reservation_id`, `extra_id`) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(3, 5),
(4, 6),
(4, 7),
(5, 8),
(5, 9),
(6, 10),
(7, 11),
(7, 12),
(8, 13),
(9, 14),
(9, 15),
(10, 16),
(11, 1),
(11, 2),
(12, 4),
(13, 1),
(13, 2),
(14, 1),
(14, 3),
(15, 23),
(16, 1),
(17, 1),
(18, 6),
(19, 1),
(20, 1),
(21, 10),
(22, 1),
(23, 15),
(24, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `flight`
--

CREATE TABLE `flight` (
  `id` int(11) NOT NULL,
  `flight_number` varchar(255) NOT NULL,
  `origin` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `departure_date` datetime NOT NULL,
  `arrival_date` datetime NOT NULL,
  `base_price` int(11) NOT NULL,
  `total_seats` int(11) NOT NULL,
  `seats_available` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `flight`
--

INSERT INTO `flight` (`id`, `flight_number`, `origin`, `destination`, `departure_date`, `arrival_date`, `base_price`, `total_seats`, `seats_available`) VALUES
(1, 'VY1234', 'Barcelona', 'Madrid', '2025-05-05 08:00:00', '2025-05-05 09:30:00', 50, 180, 164),
(2, 'VY5678', 'Madrid', 'Paris', '2025-05-06 10:00:00', '2025-05-06 12:30:00', 80, 200, 189),
(3, 'VY9012', 'Barcelona', 'Rome', '2025-05-07 14:00:00', '2025-05-07 16:30:00', 70, 150, 145),
(4, 'VY1001', 'Barcelona', 'London', '2025-05-08 09:00:00', '2025-05-08 11:30:00', 90, 180, 175),
(5, 'VY1002', 'Madrid', 'Amsterdam', '2025-05-09 12:00:00', '2025-05-09 14:45:00', 110, 200, 195),
(6, 'VY1003', 'Paris', 'Barcelona', '2025-05-10 15:00:00', '2025-05-10 17:00:00', 85, 150, 140),
(7, 'VY1004', 'Rome', 'Madrid', '2025-05-11 07:30:00', '2025-05-11 10:00:00', 95, 180, 170),
(8, 'VY1005', 'Lisbon', 'Barcelona', '2025-05-06 11:00:00', '2025-05-06 13:15:00', 70, 150, 142),
(9, 'VY1006', 'Barcelona', 'Berlin', '2025-05-07 14:30:00', '2025-05-07 17:30:00', 100, 200, 190),
(10, 'VY1007', 'Madrid', 'Vienna', '2025-05-08 08:00:00', '2025-05-08 11:00:00', 120, 180, 175),
(11, 'VY1008', 'Paris', 'Rome', '2025-05-09 10:30:00', '2025-05-09 12:45:00', 80, 150, 145),
(12, 'VY1009', 'Barcelona', 'Athens', '2025-05-10 13:00:00', '2025-05-10 16:30:00', 130, 200, 195),
(13, 'VY1010', 'Madrid', 'Prague', '2025-06-11 09:30:00', '2025-06-11 12:15:00', 105, 180, 170),
(14, 'VY1011', 'Barcelona', 'Dublin', '2025-05-05 07:00:00', '2025-05-05 09:45:00', 95, 150, 136),
(15, 'VY1012', 'Madrid', 'Budapest', '2025-06-06 11:30:00', '2025-06-06 14:30:00', 115, 200, 190),
(16, 'VY1013', 'Paris', 'Lisbon', '2025-06-07 14:00:00', '2025-06-07 16:15:00', 75, 150, 144),
(17, 'VY1014', 'Rome', 'Barcelona', '2025-05-08 08:30:00', '2025-05-08 10:30:00', 85, 180, 174),
(18, 'VY1015', 'Barcelona', 'Stockholm', '2025-06-09 12:00:00', '2025-06-09 15:45:00', 140, 200, 195),
(19, 'VY1016', 'Madrid', 'Copenhagen', '2025-06-10 10:00:00', '2025-06-10 13:15:00', 125, 180, 170),
(20, 'VY1017', 'Paris', 'Madrid', '2025-06-11 15:30:00', '2025-06-11 17:45:00', 90, 150, 140),
(21, 'VY1018', 'Barcelona', 'Zurich', '2025-06-05 09:00:00', '2025-06-05 11:00:00', 100, 200, 190),
(22, 'VY1019', 'Madrid', 'Brussels', '2025-06-06 13:30:00', '2025-06-06 15:45:00', 95, 180, 175),
(23, 'VY1020', 'Rome', 'Paris', '2025-06-07 07:30:00', '2025-06-07 09:45:00', 80, 150, 145),
(24, 'VY1021', 'Barcelona', 'Oslo', '2025-06-08 11:00:00', '2025-06-08 14:30:00', 135, 200, 195),
(25, 'VY1022', 'Madrid', 'Helsinki', '2025-06-09 08:00:00', '2025-05-10 12:15:00', 150, 180, 170),
(26, 'VY1023', 'Paris', 'Barcelona', '2025-06-10 14:00:00', '2025-06-10 16:00:00', 85, 150, 140),
(27, 'VY1024', 'Rome', 'Madrid', '2025-06-11 10:30:00', '2025-06-11 13:00:00', 95, 180, 175),
(28, 'VY1025', 'Lisbon', 'Barcelona', '2025-06-05 12:00:00', '2025-06-05 14:15:00', 70, 150, 145),
(29, 'VY1026', 'Barcelona', 'Berlin', '2025-05-06 15:30:00', '2025-05-06 18:30:00', 100, 200, 188),
(30, 'VY1027', 'Madrid', 'Vienna', '2025-06-07 07:00:00', '2025-06-07 10:00:00', 120, 180, 175),
(31, 'VY1028', 'Paris', 'Rome', '2025-06-08 11:30:00', '2025-06-08 13:45:00', 80, 150, 145),
(32, 'VY1029', 'Barcelona', 'Athens', '2025-06-09 14:00:00', '2025-06-09 17:30:00', 130, 200, 195),
(33, 'VY1030', 'Madrid', 'Prague', '2025-06-10 09:30:00', '2025-06-10 12:15:00', 105, 180, 170),
(34, 'VY1031', 'Barcelona', 'Dublin', '2025-06-11 07:00:00', '2025-06-11 09:45:00', 95, 150, 140),
(35, 'VY1032', 'Madrid', 'Budapest', '2025-06-05 11:30:00', '2025-06-05 14:30:00', 115, 200, 190),
(36, 'VY1033', 'Paris', 'Lisbon', '2025-06-06 14:00:00', '2025-06-06 16:15:00', 75, 150, 145),
(37, 'VY1034', 'Rome', 'Barcelona', '2025-05-07 08:30:00', '2025-05-07 10:30:00', 85, 180, 172),
(38, 'VY1035', 'Barcelona', 'Stockholm', '2025-05-08 12:00:00', '2025-05-08 15:45:00', 140, 200, 194),
(39, 'VY1036', 'Madrid', 'Copenhagen', '2025-06-09 10:00:00', '2025-06-09 13:15:00', 125, 180, 170),
(40, 'VY1037', 'Paris', 'Madrid', '2025-06-10 15:30:00', '2025-06-10 17:45:00', 90, 150, 140),
(41, 'VY1038', 'Barcelona', 'Zurich', '2025-06-11 09:00:00', '2025-06-11 11:00:00', 100, 200, 190),
(42, 'VY1039', 'Madrid', 'Brussels', '2025-06-05 13:30:00', '2025-06-05 15:45:00', 95, 180, 175),
(43, 'VY1040', 'Rome', 'Paris', '2025-06-06 07:30:00', '2025-06-06 09:45:00', 80, 150, 145),
(44, 'VY1041', 'Barcelona', 'Oslo', '2025-06-07 11:00:00', '2025-06-07 14:30:00', 135, 200, 195),
(45, 'VY1042', 'Madrid', 'Helsinki', '2025-06-08 08:00:00', '2025-06-08 12:15:00', 150, 180, 170),
(46, 'VY1043', 'Paris', 'Barcelona', '2025-06-09 14:00:00', '2025-06-09 16:00:00', 85, 150, 140),
(47, 'VY1044', 'Rome', 'Madrid', '2025-06-10 10:30:00', '2025-06-10 13:00:00', 95, 180, 175),
(48, 'VY1045', 'Lisbon', 'Barcelona', '2025-06-11 12:00:00', '2025-06-11 14:15:00', 70, 150, 145),
(49, 'VY1046', 'Barcelona', 'Berlin', '2025-06-05 15:30:00', '2025-06-05 18:30:00', 100, 200, 190),
(50, 'VY1047', 'Madrid', 'Vienna', '2025-05-06 07:00:00', '2025-05-06 10:00:00', 120, 180, 174),
(51, 'VY1048', 'Paris', 'Rome', '2025-06-07 11:30:00', '2025-06-07 13:45:00', 80, 150, 145),
(55, 'FL4147', 'Málaga', 'Vigo', '2025-07-01 09:36:28', '2025-07-01 10:36:28', 155, 117, 117),
(56, 'FL8317', 'Alicante', 'Barcelona', '2025-06-17 22:35:33', '2025-06-18 02:35:33', 173, 160, 160),
(57, 'FL5234', 'Alicante', 'Sevilla', '2025-07-20 09:21:49', '2025-07-20 12:21:49', 297, 164, 164),
(58, 'FL7865', 'Alicante', 'San Sebastián', '2025-06-17 15:26:36', '2025-06-17 17:26:36', 100, 116, 116),
(59, 'FL4019', 'Madrid', 'Tenerife', '2025-06-09 10:16:39', '2025-06-09 14:16:39', 126, 123, 123),
(60, 'FL9586', 'Zurich', 'Copenhagen', '2025-06-27 04:58:45', '2025-06-27 05:58:45', 123, 175, 175),
(61, 'FL6125', 'Oslo', 'Sevilla', '2025-07-26 20:06:56', '2025-07-26 23:06:56', 64, 114, 114),
(62, 'FL8602', 'Athens', 'Zurich', '2025-06-28 05:42:31', '2025-06-28 08:42:31', 250, 188, 188),
(63, 'FL9458', 'Sevilla', 'Helsinki', '2025-06-09 13:06:09', '2025-06-09 17:06:09', 279, 120, 120),
(64, 'FL5495', 'Alicante', 'Budapest', '2025-06-11 01:43:59', '2025-06-11 03:43:59', 186, 173, 173),
(65, 'FL8084', 'Vigo', 'London', '2025-08-05 18:34:52', '2025-08-05 21:34:52', 150, 165, 165),
(66, 'FL6307', 'Dublin', 'San Sebastián', '2025-06-28 13:43:15', '2025-06-28 15:43:15', 55, 121, 121),
(67, 'FL3932', 'Brussels', 'Rome', '2025-05-24 17:36:15', '2025-05-24 19:36:15', 300, 160, 160),
(68, 'FL8679', 'Sevilla', 'Prague', '2025-06-21 04:50:42', '2025-06-21 06:50:42', 175, 197, 197),
(69, 'FL6186', 'Sevilla', 'Athens', '2025-06-25 23:46:47', '2025-06-26 01:46:47', 285, 197, 197),
(70, 'FL2549', 'Vienna', 'Madrid', '2025-05-27 08:11:09', '2025-05-27 10:11:09', 100, 171, 171),
(71, 'FL9584', 'Vienna', 'Helsinki', '2025-05-16 02:15:41', '2025-05-16 06:15:41', 251, 143, 143),
(72, 'FL9511', 'Tenerife', 'Lisbon', '2025-06-01 13:39:20', '2025-06-01 17:39:20', 63, 142, 142),
(73, 'FL9051', 'Stockholm', 'Dublin', '2025-07-26 00:15:19', '2025-07-26 04:15:19', 254, 177, 177),
(74, 'FL9121', 'Lisbon', 'Stockholm', '2025-07-30 23:36:23', '2025-07-31 00:36:23', 287, 134, 134),
(75, 'FL1508', 'Barcelona', 'Budapest', '2025-07-14 23:32:55', '2025-07-15 01:32:55', 187, 178, 178),
(76, 'FL3855', 'Sevilla', 'Málaga', '2025-07-25 05:59:27', '2025-07-25 08:59:27', 104, 175, 175),
(77, 'FL7857', 'Stockholm', 'Zurich', '2025-08-06 23:28:29', '2025-08-07 02:28:29', 180, 129, 129),
(78, 'FL9782', 'Málaga', 'Barcelona', '2025-06-06 03:28:29', '2025-06-06 07:28:29', 193, 139, 139),
(79, 'FL3505', 'Brussels', 'Lisbon', '2025-06-03 10:05:03', '2025-06-03 11:05:03', 96, 102, 102),
(80, 'FL4148', 'Dublin', 'Madrid', '2025-05-27 09:57:36', '2025-05-27 12:57:36', 287, 126, 126),
(81, 'FL8502', 'Sevilla', 'San Sebastián', '2025-07-10 09:30:47', '2025-07-10 13:30:47', 69, 141, 141),
(82, 'FL6034', 'Amsterdam', 'Alicante', '2025-07-02 23:27:37', '2025-07-03 03:27:37', 218, 176, 176),
(83, 'FL7039', 'Brussels', 'Copenhagen', '2025-08-11 02:09:08', '2025-08-11 06:09:08', 266, 122, 122),
(84, 'FL6586', 'Copenhagen', 'Vienna', '2025-07-07 02:58:34', '2025-07-07 03:58:34', 137, 102, 102),
(85, 'FL5914', 'Budapest', 'Helsinki', '2025-07-08 22:49:37', '2025-07-09 01:49:37', 216, 118, 118),
(86, 'FL5397', 'Zurich', 'Stockholm', '2025-05-24 11:04:09', '2025-05-24 15:04:09', 109, 183, 183),
(87, 'FL7530', 'Zurich', 'Paris', '2025-08-07 01:18:07', '2025-08-07 04:18:07', 212, 113, 113),
(88, 'FL7132', 'Tenerife', 'Alicante', '2025-06-03 22:39:13', '2025-06-04 02:39:13', 214, 179, 179),
(89, 'FL9480', 'Budapest', 'Copenhagen', '2025-07-26 12:14:30', '2025-07-26 16:14:30', 180, 193, 193),
(90, 'FL1839', 'Dublin', 'Paris', '2025-05-22 10:49:13', '2025-05-22 12:49:13', 215, 138, 138),
(91, 'FL8218', 'Berlin', 'Budapest', '2025-07-03 09:11:38', '2025-07-03 10:11:38', 139, 139, 139),
(92, 'FL2917', 'Zurich', 'Tenerife', '2025-06-28 08:34:47', '2025-06-28 09:34:47', 73, 126, 126),
(93, 'FL1637', 'Oslo', 'Barcelona', '2025-06-03 07:42:22', '2025-06-03 09:42:22', 172, 197, 197),
(94, 'FL5172', 'San Sebastián', 'Zurich', '2025-05-24 23:26:36', '2025-05-25 00:26:36', 183, 196, 196),
(95, 'FL4790', 'Madrid', 'Amsterdam', '2025-05-18 13:34:36', '2025-05-18 17:34:36', 52, 170, 170),
(96, 'FL6940', 'Athens', 'Helsinki', '2025-06-06 21:39:27', '2025-06-07 01:39:27', 278, 134, 134),
(97, 'FL3769', 'Lisbon', 'Oslo', '2025-08-04 18:50:01', '2025-08-04 20:50:01', 116, 129, 129),
(98, 'FL3392', 'Paris', 'Amsterdam', '2025-07-18 12:43:46', '2025-07-18 15:43:46', 277, 119, 119),
(99, 'FL9666', 'Vigo', 'Helsinki', '2025-08-09 05:28:56', '2025-08-09 09:28:56', 197, 110, 110),
(100, 'FL2896', 'Copenhagen', 'Stockholm', '2025-06-11 10:31:44', '2025-06-11 11:31:44', 123, 107, 107),
(101, 'FL8172', 'Helsinki', 'Berlin', '2025-08-05 07:08:11', '2025-08-05 09:08:11', 63, 183, 183),
(102, 'FL5469', 'Copenhagen', 'Stockholm', '2025-08-12 14:04:49', '2025-08-12 17:04:49', 204, 101, 101),
(103, 'FL7553', 'Budapest', 'Sevilla', '2025-06-26 01:26:08', '2025-06-26 02:26:08', 227, 180, 180),
(104, 'FL9428', 'Brussels', 'Alicante', '2025-07-05 00:56:57', '2025-07-05 02:56:57', 159, 194, 194),
(105, 'FL6779', 'Athens', 'Prague', '2025-07-05 14:21:56', '2025-07-05 16:21:56', 284, 157, 157),
(106, 'FL2086', 'Prague', 'Alicante', '2025-05-23 22:20:05', '2025-05-24 00:20:05', 294, 173, 173),
(107, 'FL2294', 'Tenerife', 'Budapest', '2025-07-12 20:30:00', '2025-07-13 00:30:00', 198, 165, 165),
(108, 'FL9857', 'Berlin', 'Zurich', '2025-07-14 19:04:30', '2025-07-14 23:04:30', 127, 155, 155),
(109, 'FL8667', 'Alicante', 'Dublin', '2025-07-03 18:50:17', '2025-07-03 22:50:17', 247, 193, 193),
(110, 'FL6562', 'Barcelona', 'Berlin', '2025-07-23 16:09:05', '2025-07-23 20:09:05', 73, 140, 140),
(111, 'FL5479', 'Berlin', 'Paris', '2025-05-18 14:30:07', '2025-05-18 18:30:07', 186, 104, 104),
(112, 'FL9196', 'Barcelona', 'Zurich', '2025-06-22 22:23:37', '2025-06-23 00:23:37', 194, 165, 165),
(113, 'FL7082', 'Brussels', 'Vienna', '2025-07-25 17:51:37', '2025-07-25 19:51:37', 252, 111, 111),
(114, 'FL4697', 'Copenhagen', 'Vienna', '2025-07-08 05:11:24', '2025-07-08 08:11:24', 52, 148, 148),
(115, 'FL9844', 'Sevilla', 'Barcelona', '2025-07-13 17:17:19', '2025-07-13 18:17:19', 291, 103, 103),
(116, 'FL2310', 'Paris', 'London', '2025-06-23 15:20:01', '2025-06-23 19:20:01', 145, 134, 134),
(117, 'FL6797', 'Zurich', 'London', '2025-05-31 18:09:15', '2025-05-31 20:09:15', 98, 114, 114),
(118, 'FL1766', 'Athens', 'Stockholm', '2025-07-20 10:41:29', '2025-07-20 11:41:29', 189, 136, 136),
(119, 'FL9960', 'Lisbon', 'Sevilla', '2025-06-14 14:55:06', '2025-06-14 16:55:06', 142, 132, 132),
(120, 'FL7618', 'Amsterdam', 'Madrid', '2025-07-27 01:40:33', '2025-07-27 03:40:33', 110, 157, 157),
(121, 'FL2205', 'Alicante', 'Prague', '2025-05-28 06:34:25', '2025-05-28 07:34:25', 82, 112, 112),
(122, 'FL2827', 'Sevilla', 'Vienna', '2025-07-02 10:30:12', '2025-07-02 14:30:12', 190, 147, 147),
(123, 'FL6800', 'San Sebastián', 'Lisbon', '2025-06-15 21:02:18', '2025-06-16 01:02:18', 87, 180, 180),
(124, 'FL3350', 'Madrid', 'Dublin', '2025-07-03 10:54:45', '2025-07-03 14:54:45', 271, 178, 178),
(125, 'FL5396', 'Amsterdam', 'Rome', '2025-06-29 04:07:05', '2025-06-29 07:07:05', 249, 122, 122),
(126, 'FL8406', 'Sevilla', 'Alicante', '2025-07-25 23:44:54', '2025-07-26 02:44:54', 206, 147, 147),
(127, 'FL9254', 'Barcelona', 'Málaga', '2025-07-06 16:57:26', '2025-07-06 19:57:26', 103, 131, 131),
(128, 'FL6161', 'Madrid', 'Vienna', '2025-06-09 16:52:51', '2025-06-09 18:52:51', 61, 131, 131),
(129, 'FL9939', 'Budapest', 'Brussels', '2025-06-02 21:48:35', '2025-06-02 23:48:35', 120, 153, 153),
(130, 'FL7746', 'Amsterdam', 'Vigo', '2025-06-16 20:53:54', '2025-06-16 21:53:54', 202, 132, 132),
(131, 'FL5973', 'Amsterdam', 'Brussels', '2025-07-27 03:42:17', '2025-07-27 05:42:17', 236, 164, 164),
(132, 'FL8143', 'Copenhagen', 'Sevilla', '2025-05-13 04:59:12', '2025-05-13 07:59:12', 201, 175, 175),
(133, 'FL7797', 'Oslo', 'Vienna', '2025-06-03 03:41:17', '2025-06-03 05:41:17', 215, 170, 170),
(134, 'FL2344', 'Barcelona', 'Budapest', '2025-05-16 06:49:57', '2025-05-16 09:49:57', 297, 161, 161),
(135, 'FL8214', 'Madrid', 'Vigo', '2025-06-30 09:15:49', '2025-06-30 12:15:49', 272, 161, 161),
(136, 'FL9825', 'Vigo', 'Zurich', '2025-07-17 08:10:43', '2025-07-17 11:10:43', 99, 169, 169),
(137, 'FL1261', 'Dublin', 'Madrid', '2025-05-14 08:58:53', '2025-05-14 11:58:53', 274, 186, 186),
(138, 'FL3214', 'San Sebastián', 'Brussels', '2025-06-09 03:27:48', '2025-06-09 07:27:48', 166, 154, 154),
(139, 'FL5587', 'Prague', 'Sevilla', '2025-06-26 10:29:56', '2025-06-26 14:29:56', 282, 199, 199),
(140, 'FL9119', 'Stockholm', 'Tenerife', '2025-06-21 09:14:41', '2025-06-21 13:14:41', 155, 126, 126),
(141, 'FL8213', 'San Sebastián', 'Madrid', '2025-06-10 13:47:25', '2025-06-10 15:47:25', 162, 119, 119),
(142, 'FL6515', 'Dublin', 'Vigo', '2025-05-18 22:57:04', '2025-05-19 02:57:04', 164, 175, 175),
(143, 'FL4875', 'Dublin', 'Amsterdam', '2025-05-14 22:57:42', '2025-05-14 23:57:42', 286, 162, 162),
(144, 'FL2989', 'Helsinki', 'Stockholm', '2025-06-13 13:00:56', '2025-06-13 16:00:56', 127, 196, 196),
(145, 'FL5511', 'Paris', 'Tenerife', '2025-06-06 23:47:05', '2025-06-07 00:47:05', 174, 183, 183),
(146, 'FL2552', 'Dublin', 'Rome', '2025-06-17 10:54:56', '2025-06-17 14:54:56', 71, 125, 125),
(147, 'FL6905', 'Brussels', 'Helsinki', '2025-08-09 07:37:54', '2025-08-09 08:37:54', 295, 163, 163),
(148, 'FL3814', 'Prague', 'Athens', '2025-06-29 00:49:26', '2025-06-29 02:49:26', 210, 177, 177),
(149, 'FL4554', 'Alicante', 'Athens', '2025-06-13 00:04:27', '2025-06-13 03:04:27', 214, 128, 128),
(150, 'FL9133', 'Barcelona', 'Budapest', '2025-07-01 21:15:18', '2025-07-01 23:15:18', 139, 197, 197),
(151, 'FL4551', 'Alicante', 'Helsinki', '2025-05-18 19:10:58', '2025-05-18 23:10:58', 88, 158, 158),
(152, 'FL3894', 'Alicante', 'Athens', '2025-06-09 22:36:09', '2025-06-10 00:36:09', 208, 104, 104),
(153, 'FL7171', 'Budapest', 'Barcelona', '2025-07-12 00:59:51', '2025-07-12 02:59:51', 130, 126, 126),
(154, 'FL5714', 'Dublin', 'Vienna', '2025-07-01 21:51:51', '2025-07-01 23:51:51', 72, 130, 130),
(155, 'FL9557', 'Brussels', 'San Sebastián', '2025-07-24 12:44:36', '2025-07-24 13:44:36', 95, 181, 181),
(156, 'FL7652', 'Prague', 'Madrid', '2025-05-17 03:57:32', '2025-05-17 04:57:32', 190, 182, 182),
(157, 'FL1008', 'Paris', 'Zurich', '2025-05-18 22:27:23', '2025-05-18 23:27:23', 284, 123, 123),
(158, 'FL1110', 'Athens', 'Madrid', '2025-06-16 18:46:23', '2025-06-16 20:46:23', 283, 143, 143),
(159, 'FL2259', 'San Sebastián', 'Málaga', '2025-08-05 08:46:14', '2025-08-05 10:46:14', 250, 158, 158),
(160, 'FL1875', 'Vigo', 'Lisbon', '2025-06-02 17:59:29', '2025-06-02 18:59:29', 120, 180, 180),
(161, 'FL2686', 'San Sebastián', 'Paris', '2025-05-28 07:13:55', '2025-05-28 08:13:55', 96, 124, 124),
(162, 'FL5963', 'Athens', 'Vigo', '2025-06-22 02:36:02', '2025-06-22 05:36:02', 137, 187, 187),
(163, 'FL5890', 'San Sebastián', 'Zurich', '2025-06-13 19:20:05', '2025-06-13 23:20:05', 244, 191, 191),
(164, 'FL7729', 'Helsinki', 'Prague', '2025-06-16 08:52:54', '2025-06-16 09:52:54', 260, 111, 111),
(165, 'FL5508', 'London', 'Berlin', '2025-06-03 20:42:29', '2025-06-03 22:42:29', 280, 181, 181),
(166, 'FL8796', 'Copenhagen', 'Madrid', '2025-05-31 17:38:12', '2025-05-31 21:38:12', 193, 175, 175),
(167, 'FL3602', 'Zurich', 'Budapest', '2025-07-28 13:19:01', '2025-07-28 15:19:01', 255, 163, 163),
(168, 'FL2048', 'Tenerife', 'Sevilla', '2025-05-27 12:19:45', '2025-05-27 15:19:45', 124, 169, 169),
(169, 'FL1301', 'Málaga', 'Tenerife', '2025-06-11 09:24:28', '2025-06-11 11:24:28', 89, 162, 162);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `passengers`
--

CREATE TABLE `passengers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `dni` varchar(255) NOT NULL,
  `date_birth` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `passengers`
--

INSERT INTO `passengers` (`id`, `name`, `last_name`, `dni`, `date_birth`) VALUES
(1, 'Ana', 'López', '12345678A', '1990-05-15'),
(2, 'Juan', 'Pérez', '87654321B', '1985-11-22'),
(3, 'María', 'Gómez', '45678912C', '1995-03-10'),
(4, 'Pedro', 'Sánchez', '78912345D', '1980-07-30'),
(5, 'Laura', 'Martín', '23456789E', '1992-08-12'),
(6, 'Carlos', 'Ruiz', '34567890F', '1988-04-25'),
(7, 'Sofía', 'Díaz', '45678901G', '1990-12-01'),
(8, 'David', 'Fernández', '56789012H', '1987-06-15'),
(9, 'Elena', 'Torres', '67890123I', '1993-09-22'),
(10, 'Miguel', 'García', '78901234J', '1991-02-10'),
(11, 'Lucía', 'Hernández', '89012345K', '1989-11-05'),
(12, 'Pablo', 'Moreno', '90123456L', '1994-07-20'),
(13, 'Clara', 'Jiménez', '01234567M', '1996-03-15'),
(14, 'Diego', 'Ortega', '12345678N', '1986-10-30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pay`
--

CREATE TABLE `pay` (
  `id` int(11) NOT NULL,
  `reservation_id` int(11) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_date` datetime NOT NULL,
  `state` varchar(255) NOT NULL,
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pay`
--

INSERT INTO `pay` (`id`, `reservation_id`, `amount`, `payment_method`, `payment_date`, `state`, `stripe_payment_intent_id`) VALUES
(1, 1, 80, 'credit_card', '2025-04-15 10:00:00', 'completed', NULL),
(2, 2, 90, 'paypal', '2025-04-16 12:00:00', 'pending', NULL),
(3, 3, 85, 'credit_card', '2025-04-17 15:00:00', 'completed', NULL),
(4, 4, 125, 'credit_card', '2025-04-20 11:00:00', 'completed', NULL),
(5, 5, 90, 'paypal', '2025-04-21 13:00:00', 'pending', NULL),
(6, 6, 130, 'credit_card', '2025-04-22 15:00:00', 'completed', NULL),
(7, 7, 150, 'credit_card', '2025-04-23 10:00:00', 'completed', NULL),
(9, 9, 160, 'credit_card', '2025-04-25 14:00:00', 'completed', NULL),
(10, 10, 135, 'credit_card', '2025-04-26 16:00:00', 'completed', NULL),
(11, 16, 70, 'paypal', '2025-04-22 14:12:06', 'pending', NULL),
(12, 17, 50, 'paypal', '2025-04-22 14:25:38', 'pending', NULL),
(13, 18, 50, 'paypal', '2025-04-23 10:44:36', 'pending', NULL),
(14, 19, 50, 'paypal', '2025-04-23 10:51:44', 'pending', NULL),
(16, 21, 50, 'paypal', '2025-05-05 15:39:46', 'pending', NULL),
(17, 22, 100, 'bank_transfer', '2025-05-06 17:49:39', 'pending', NULL),
(18, 23, 95, 'paypal', '2025-05-06 17:49:58', 'pending', NULL),
(19, 24, 120, 'paypal', '2025-05-06 19:54:53', 'pending', NULL),
(20, 25, 85, 'paypal', '2025-05-06 19:56:03', 'pending', NULL),
(21, 26, 140, 'paypal', '2025-05-06 19:57:04', 'pending', NULL),
(22, 27, 95, 'paypal', '2025-05-07 16:57:04', 'confirmed', NULL),
(23, 28, 95, 'Tarjeta de Crédito', '2025-05-08 17:52:48', 'confirmed', NULL),
(24, 29, 70, 'Tarjeta de Crédito', '2025-05-08 17:53:28', 'confirmed', NULL),
(25, 30, 85, 'PayPal', '2025-05-08 17:53:55', 'confirmed', NULL),
(26, 31, 85, 'PayPal', '2025-05-08 17:56:24', 'confirmed', NULL),
(27, 32, 9500, 'card', '2025-05-12 16:01:48', 'completed', 'pi_3RNwveI1BXQpOH181xyVRKfb'),
(28, 33, 15500, 'card', '2025-05-12 16:53:02', 'completed', 'pi_3RNxj8I1BXQpOH180gZyzisn'),
(29, 34, 16000, 'card', '2025-05-12 17:10:24', 'completed', 'pi_3RNy03I1BXQpOH181KkLuYPI'),
(30, 35, 7000, 'card', '2025-05-12 17:28:05', 'completed', 'pi_3RNyHBI1BXQpOH181BxRr9lC'),
(31, 36, 5000, 'card', '2025-05-12 21:16:19', 'completed', 'pi_3RO1prI1BXQpOH180wnPEQir');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `flight_id` int(11) DEFAULT NULL,
  `passengers_id` int(11) DEFAULT NULL,
  `reservation_date` date NOT NULL,
  `state` varchar(255) NOT NULL,
  `total_price` int(11) NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `flight_id`, `passengers_id`, `reservation_date`, `state`, `total_price`, `payment_method`) VALUES
(1, 1, 1, 1, '2025-04-15', 'confirmed', 80, NULL),
(2, 2, 2, 2, '2025-04-16', 'pending', 90, NULL),
(3, 3, 3, 3, '2025-04-17', 'confirmed', 85, NULL),
(4, 5, 4, 5, '2025-04-20', 'confirmed', 125, NULL),
(5, 6, 5, 6, '2025-04-21', 'pending', 90, NULL),
(6, 7, 6, 7, '2025-04-22', 'confirmed', 130, NULL),
(7, 8, 7, 8, '2025-04-23', 'confirmed', 150, NULL),
(9, 5, 9, 10, '2025-04-25', 'confirmed', 160, NULL),
(10, 6, 10, 5, '2025-04-26', 'confirmed', 135, NULL),
(11, 7, 11, 6, '2025-04-27', 'pending', 110, NULL),
(12, 8, 12, 7, '2025-04-28', 'confirmed', 145, NULL),
(14, 1, 1, NULL, '2025-04-22', 'pending', 50, 'paypal'),
(15, 1, 2, NULL, '2025-04-22', 'pending', 80, 'credit_card'),
(16, 1, 8, NULL, '2025-04-22', 'pending', 70, 'paypal'),
(17, 1, 1, NULL, '2025-04-22', 'pending', 50, 'paypal'),
(18, 1, 1, NULL, '2025-04-23', 'pending', 50, 'paypal'),
(19, 1, 1, NULL, '2025-04-23', 'pending', 50, 'paypal'),
(21, 1, 1, NULL, '2025-05-05', 'pending', 50, 'paypal'),
(22, 1, 29, NULL, '2025-05-06', 'pending', 100, 'bank_transfer'),
(23, 1, 14, NULL, '2025-05-06', 'pending', 95, 'paypal'),
(24, 1, 50, NULL, '2025-05-06', 'pending', 120, 'paypal'),
(25, 1, 37, NULL, '2025-05-06', 'pending', 85, 'paypal'),
(26, 1, 38, NULL, '2025-05-06', 'pending', 140, 'paypal'),
(27, 1, 14, NULL, '2025-05-07', 'confirmed', 95, 'paypal'),
(28, 1, 14, NULL, '2025-05-08', 'confirmed', 95, 'Tarjeta de Crédito'),
(29, 1, 8, NULL, '2025-05-08', 'confirmed', 70, 'Tarjeta de Crédito'),
(30, 1, 37, NULL, '2025-05-08', 'confirmed', 85, 'PayPal'),
(31, 1, 17, NULL, '2025-05-08', 'confirmed', 85, 'PayPal'),
(32, 1, 14, NULL, '2025-05-12', 'confirmed', 95, 'card'),
(33, 1, 37, NULL, '2025-05-12', 'confirmed', 155, 'card'),
(34, 1, 29, NULL, '2025-05-12', 'confirmed', 160, 'card'),
(35, 1, 8, NULL, '2025-05-12', 'confirmed', 70, 'card'),
(36, 1, 1, NULL, '2025-05-12', 'confirmed', 50, 'card');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(180) NOT NULL,
  `email` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` int(11) NOT NULL,
  `birthdate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `roles`, `password`, `full_name`, `phone`, `birthdate`) VALUES
(1, 'admin', 'pacopedrosa2018@gmail.com', '[\"ROLE_USER\", \"ROLE_ADMIN\"]', '$2y$13$OV9U6KAOHY75OaJyOpXekefJVF/7dSy8n/Khsn1MoF8KBLkysRn5G', 'paco pedrosa', 234567890, '2025-04-02'),
(2, 'ana', 'ana.lopez@gmail.com', '[]', '$2y$13$hashedpasswordexample12345', 'Ana López', 654123987, '1990-05-15'),
(3, 'juan', 'juan.perez@gmail.com', '[]', '$2y$13$hashedpasswordexample12345', 'Juan Pérez', 678901234, '1985-11-22'),
(4, 'maria', 'maria.gomez@gmail.com', '[]', '$2y$13$hashedpasswordexample12345', 'María Gómez', 612345678, '1995-03-10'),
(5, 'laura', 'laura.martin@gmail.com', '[]', '$2y$13$hashedpasswordexample12345', 'Laura Martín', 623456789, '1992-08-12'),
(6, 'carlos', 'carlos.ruiz@gmail.com', '[]', '$2y$13$hashedpasswordexample12345', 'Carlos Ruiz', 634567890, '1988-04-25'),
(7, 'sofia', 'sofia.diaz@gmail.com', '[]', '$2y$13$hashedpasswordexample12345', 'Sofía Díaz', 645678901, '1990-12-01'),
(8, 'david', 'david.fernandez@gmail.com', '[]', '$2y$13$hashedpasswordexample12345', 'David Fernández', 656789012, '1987-06-15'),
(26, 'trabajador', 'prueba@gmail.com', '[\"ROLE_USER\"]', '$2y$13$5vYyfiuuuqwvzNeNsaGmdOoisfNJpEvtU6W2a9g2SkQ4IkEmAbveq', 'paco pedrosa arjlonadede', 651471782, '2025-04-28');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `extra`
--
ALTER TABLE `extra`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `extra_reservation`
--
ALTER TABLE `extra_reservation`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `extra_reservation_extra`
--
ALTER TABLE `extra_reservation_extra`
  ADD PRIMARY KEY (`extra_reservation_id`,`extra_id`),
  ADD KEY `IDX_9A6D4A2F2CCDCF5F` (`extra_reservation_id`),
  ADD KEY `IDX_9A6D4A2F2B959FC6` (`extra_id`);

--
-- Indices de la tabla `flight`
--
ALTER TABLE `flight`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Indices de la tabla `passengers`
--
ALTER TABLE `passengers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pay`
--
ALTER TABLE `pay`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_FE8F223CB83297E7` (`reservation_id`);

--
-- Indices de la tabla `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_4DA239A76ED395` (`user_id`),
  ADD KEY `IDX_4DA23991F478C5` (`flight_id`),
  ADD KEY `IDX_4DA239DAEC2A17` (`passengers_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `extra`
--
ALTER TABLE `extra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `extra_reservation`
--
ALTER TABLE `extra_reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `flight`
--
ALTER TABLE `flight`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `passengers`
--
ALTER TABLE `passengers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `pay`
--
ALTER TABLE `pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `extra_reservation_extra`
--
ALTER TABLE `extra_reservation_extra`
  ADD CONSTRAINT `FK_9A6D4A2F2B959FC6` FOREIGN KEY (`extra_id`) REFERENCES `extra` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_9A6D4A2F2CCDCF5F` FOREIGN KEY (`extra_reservation_id`) REFERENCES `extra_reservation` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pay`
--
ALTER TABLE `pay`
  ADD CONSTRAINT `FK_FE8F223CB83297E7` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`);

--
-- Filtros para la tabla `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `FK_4DA23991F478C5` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`id`),
  ADD CONSTRAINT `FK_4DA239A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_4DA239DAEC2A17` FOREIGN KEY (`passengers_id`) REFERENCES `passengers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
