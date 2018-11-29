const countries = [
  {
    countryId: 42,
    name: 'Afghanistan',
    mapIndex: 1
  },
  {
    countryId: 23,
    name: 'Angola',
    mapIndex: 2
  },
  {
    countryId: 141,
    name: 'Albania',
    mapIndex: 4
  },
  {
    countryId: 181,
    name: 'Andorra',
    mapIndex: 6
  },
  {
    countryId: 115,
    name: 'United Arab Emirates',
    mapIndex: 7
  },
  {
    countryId: 8,
    name: 'Argentina',
    mapIndex: 8
  },
  {
    countryId: 140,
    name: 'Armenia',
    mapIndex: 9
  },
  {
    countryId: 183,
    name: 'Antigua and Barb.',
    mapIndex: 14
  },
  {
    countryId: 6,
    name: 'Australia',
    mapIndex: 15
  },
  {
    countryId: 114,
    name: 'Austria',
    mapIndex: 16
  },
  {
    countryId: 113,
    name: 'Azerbaijan',
    mapIndex: 17
  },
  {
    countryId: 144,
    name: 'Burundi',
    mapIndex: 18
  },
  {
    countryId: 138,
    name: 'Belgium',
    mapIndex: 19
  },
  {
    countryId: 101,
    name: 'Benin',
    mapIndex: 20
  },
  {
    countryId: 75,
    name: 'Burkina Faso',
    mapIndex: 21
  },
  {
    countryId: 93,
    name: 'Bangladesh',
    mapIndex: 22
  },
  {
    countryId: 104,
    name: 'Bulgaria',
    mapIndex: 23
  },
  {
    countryId: 178,
    name: 'Bahrain',
    mapIndex: 24
  },
  {
    countryId: 157,
    name: 'Bahamas',
    mapIndex: 25
  },
  {
    countryId: 126,
    name: 'Bosnia and Herz.',
    mapIndex: 26
  },
  {
    countryId: 85,
    name: 'Belarus',
    mapIndex: 28
  },
  {
    countryId: 149,
    name: 'Belize',
    mapIndex: 29
  },
  {
    countryId: 28,
    name: 'Bolivia',
    mapIndex: 31
  },
  {
    countryId: 5,
    name: 'Brazil',
    mapIndex: 32
  },
  {
    countryId: 184,
    name: 'Barbados',
    mapIndex: 33
  },
  {
    countryId: 165,
    name: 'Brunei',
    mapIndex: 34
  },
  {
    countryId: 130,
    name: 'Bhutan',
    mapIndex: 35
  },
  {
    countryId: 47,
    name: 'Botswana',
    mapIndex: 36
  },
  {
    countryId: 44,
    name: 'Central African Rep.',
    mapIndex: 37
  },
  {
    countryId: 2,
    name: 'Canada',
    mapIndex: 38
  },
  {
    countryId: 134,
    name: 'Switzerland',
    mapIndex: 39
  },
  {
    countryId: 38,
    name: 'Chile',
    mapIndex: 40
  },
  {
    countryId: 3,
    name: 'China',
    mapIndex: 41
  },
  {
    countryId: 69,
    name: "Côte d'Ivoire",
    mapIndex: 42
  },
  {
    countryId: 54,
    name: 'Cameroon',
    mapIndex: 43
  },
  {
    countryId: 11,
    name: 'Dem. Rep. Congo',
    mapIndex: 44
  },
  {
    countryId: 64,
    name: 'Congo',
    mapIndex: 45
  },
  {
    countryId: 26,
    name: 'Colombia',
    mapIndex: 47
  },
  {
    countryId: 170,
    name: 'Comoros',
    mapIndex: 48
  },
  {
    countryId: 167,
    name: 'Cape Verde',
    mapIndex: 49
  },
  {
    countryId: 127,
    name: 'Costa Rica',
    mapIndex: 50
  },
  {
    countryId: 105,
    name: 'Cuba',
    mapIndex: 51
  },
  {
    countryId: 164,
    name: 'Cyprus',
    mapIndex: 55
  },
  {
    countryId: 116,
    name: 'Czech Rep.',
    mapIndex: 56
  },
  {
    countryId: 63,
    name: 'Germany',
    mapIndex: 57
  },
  {
    countryId: 150,
    name: 'Djibouti',
    mapIndex: 58
  },
  {
    countryId: 173,
    name: 'Dominica',
    mapIndex: 59
  },
  {
    countryId: 132,
    name: 'Denmark',
    mapIndex: 60
  },
  {
    countryId: 129,
    name: 'Dominican Rep.',
    mapIndex: 61
  },
  {
    countryId: 10,
    name: 'Algeria',
    mapIndex: 62
  },
  {
    countryId: 74,
    name: 'Ecuador',
    mapIndex: 63
  },
  {
    countryId: 30,
    name: 'Egypt',
    mapIndex: 64
  },
  {
    countryId: 98,
    name: 'Eritrea',
    mapIndex: 65
  },
  {
    countryId: 52,
    name: 'Spain',
    mapIndex: 66
  },
  {
    countryId: 131,
    name: 'Estonia',
    mapIndex: 67
  },
  {
    countryId: 27,
    name: 'Ethiopia',
    mapIndex: 68
  },
  {
    countryId: 65,
    name: 'Finland',
    mapIndex: 69
  },
  {
    countryId: 153,
    name: 'Fiji',
    mapIndex: 70
  },
  {
    countryId: 41,
    name: 'France',
    mapIndex: 72
  },
  {
    countryId: 176,
    name: 'Micronesia',
    mapIndex: 74
  },
  {
    countryId: 77,
    name: 'Gabon',
    mapIndex: 75
  },
  {
    countryId: 79,
    name: 'United Kingdom',
    mapIndex: 76
  },
  {
    countryId: 120,
    name: 'Georgia',
    mapIndex: 77
  },
  {
    countryId: 81,
    name: 'Ghana',
    mapIndex: 79
  },
  {
    countryId: 78,
    name: 'Guinea',
    mapIndex: 80
  },
  {
    countryId: 161,
    name: 'Gambia',
    mapIndex: 81
  },
  {
    countryId: 135,
    name: 'Guinea-Bissau',
    mapIndex: 82
  },
  {
    countryId: 143,
    name: 'Eq. Guinea',
    mapIndex: 83
  },
  {
    countryId: 96,
    name: 'Greece',
    mapIndex: 84
  },
  {
    countryId: 186,
    name: 'Grenada',
    mapIndex: 85
  },
  {
    countryId: 12,
    name: 'Greenland',
    mapIndex: 86
  },
  {
    countryId: 106,
    name: 'Guatemala',
    mapIndex: 87
  },
  {
    countryId: 84,
    name: 'Guyana',
    mapIndex: 89
  },
  {
    countryId: 102,
    name: 'Honduras',
    mapIndex: 92
  },
  {
    countryId: 125,
    name: 'Croatia',
    mapIndex: 93
  },
  {
    countryId: 145,
    name: 'Haiti',
    mapIndex: 94
  },
  {
    countryId: 109,
    name: 'Hungary',
    mapIndex: 95
  },
  {
    countryId: 15,
    name: 'Indonesia',
    mapIndex: 96
  },
  {
    countryId: 7,
    name: 'India',
    mapIndex: 98
  },
  {
    countryId: 119,
    name: 'Ireland',
    mapIndex: 101
  },
  {
    countryId: 18,
    name: 'Iran',
    mapIndex: 102
  },
  {
    countryId: 59,
    name: 'Iraq',
    mapIndex: 103
  },
  {
    countryId: 107,
    name: 'Iceland',
    mapIndex: 104
  },
  {
    countryId: 146,
    name: 'Israel',
    mapIndex: 105
  },
  {
    countryId: 72,
    name: 'Italy',
    mapIndex: 106
  },
  {
    countryId: 162,
    name: 'Jamaica',
    mapIndex: 107
  },
  {
    countryId: 110,
    name: 'Jordan',
    mapIndex: 109
  },
  {
    countryId: 62,
    name: 'Japan',
    mapIndex: 110
  },
  {
    countryId: 9,
    name: 'Kazakhstan',
    mapIndex: 112
  },
  {
    countryId: 49,
    name: 'Kenya',
    mapIndex: 113
  },
  {
    countryId: 86,
    name: 'Kyrgyzstan',
    mapIndex: 114
  },
  {
    countryId: 89,
    name: 'Cambodia',
    mapIndex: 115
  },
  {
    countryId: 175,
    name: 'Kiribati',
    mapIndex: 116
  },
  {
    countryId: 189,
    name: 'St. Kitts and Nevis',
    mapIndex: 117
  },
  {
    countryId: 108,
    name: 'Korea',
    mapIndex: 118
  },
  {
    countryId: 154,
    name: 'Kuwait',
    mapIndex: 120
  },
  {
    countryId: 83,
    name: 'Lao PDR',
    mapIndex: 121
  },
  {
    countryId: 163,
    name: 'Lebanon',
    mapIndex: 122
  },
  {
    countryId: 103,
    name: 'Liberia',
    mapIndex: 123
  },
  {
    countryId: 17,
    name: 'Libya',
    mapIndex: 124
  },
  {
    countryId: 179,
    name: 'Saint Lucia',
    mapIndex: 125
  },
  {
    countryId: 190,
    name: 'Liechtenstein',
    mapIndex: 126
  },
  {
    countryId: 121,
    name: 'Sri Lanka',
    mapIndex: 127
  },
  {
    countryId: 139,
    name: 'Lesotho',
    mapIndex: 128
  },
  {
    countryId: 122,
    name: 'Lithuania',
    mapIndex: 129
  },
  {
    countryId: 169,
    name: 'Luxembourg',
    mapIndex: 130
  },
  {
    countryId: 123,
    name: 'Latvia',
    mapIndex: 131
  },
  {
    countryId: 58,
    name: 'Morocco',
    mapIndex: 134
  },
  {
    countryId: 137,
    name: 'Moldova',
    mapIndex: 136
  },
  {
    countryId: 48,
    name: 'Madagascar',
    mapIndex: 137
  },
  {
    countryId: 188,
    name: 'Maldives',
    mapIndex: 138
  },
  {
    countryId: 14,
    name: 'Mexico',
    mapIndex: 139
  },
  {
    countryId: 148,
    name: 'Macedonia',
    mapIndex: 141
  },
  {
    countryId: 24,
    name: 'Mali',
    mapIndex: 142
  },
  {
    countryId: 187,
    name: 'Malta',
    mapIndex: 143
  },
  {
    countryId: 40,
    name: 'Myanmar',
    mapIndex: 144
  },
  {
    countryId: 158,
    name: 'Montenegro',
    mapIndex: 145
  },
  {
    countryId: 19,
    name: 'Mongolia',
    mapIndex: 146
  },
  {
    countryId: 36,
    name: 'Mozambique',
    mapIndex: 148
  },
  {
    countryId: 29,
    name: 'Mauritania',
    mapIndex: 149
  },
  {
    countryId: 171,
    name: 'Mauritius',
    mapIndex: 151
  },
  {
    countryId: 100,
    name: 'Malawi',
    mapIndex: 152
  },
  {
    countryId: 66,
    name: 'Malaysia',
    mapIndex: 153
  },
  {
    countryId: 34,
    name: 'Namibia',
    mapIndex: 154
  },
  {
    countryId: 22,
    name: 'Niger',
    mapIndex: 156
  },
  {
    countryId: 32,
    name: 'Nigeria',
    mapIndex: 158
  },
  {
    countryId: 97,
    name: 'Nicaragua',
    mapIndex: 159
  },
  {
    countryId: 133,
    name: 'Netherlands',
    mapIndex: 161
  },
  {
    countryId: 68,
    name: 'Norway',
    mapIndex: 162
  },
  {
    countryId: 94,
    name: 'Nepal',
    mapIndex: 163
  },
  {
    countryId: 76,
    name: 'New Zealand',
    mapIndex: 165
  },
  {
    countryId: 71,
    name: 'Oman',
    mapIndex: 166
  },
  {
    countryId: 35,
    name: 'Pakistan',
    mapIndex: 167
  },
  {
    countryId: 117,
    name: 'Panama',
    mapIndex: 168
  },
  {
    countryId: 20,
    name: 'Peru',
    mapIndex: 170
  },
  {
    countryId: 73,
    name: 'Philippines',
    mapIndex: 171
  },
  {
    countryId: 182,
    name: 'Palau',
    mapIndex: 172
  },
  {
    countryId: 55,
    name: 'Papua New Guinea',
    mapIndex: 173
  },
  {
    countryId: 70,
    name: 'Poland',
    mapIndex: 174
  },
  {
    countryId: 99,
    name: 'Dem. Rep. Korea',
    mapIndex: 176
  },
  {
    countryId: 111,
    name: 'Portugal',
    mapIndex: 177
  },
  {
    countryId: 60,
    name: 'Paraguay',
    mapIndex: 178
  },
  {
    countryId: 160,
    name: 'Qatar',
    mapIndex: 181
  },
  {
    countryId: 82,
    name: 'Romania',
    mapIndex: 182
  },
  {
    countryId: 1,
    name: 'Russia',
    mapIndex: 183
  },
  {
    countryId: 147,
    name: 'Rwanda',
    mapIndex: 184
  },
  {
    countryId: 13,
    name: 'Saudi Arabia',
    mapIndex: 186
  },
  {
    countryId: 16,
    name: 'Sudan',
    mapIndex: 187
  },
  {
    countryId: 45,
    name: 'S. Sudan',
    mapIndex: 188
  },
  {
    countryId: 87,
    name: 'Senegal',
    mapIndex: 189
  },
  {
    countryId: 177,
    name: 'Singapore',
    mapIndex: 190
  },
  {
    countryId: 142,
    name: 'Solomon Is.',
    mapIndex: 193
  },
  {
    countryId: 118,
    name: 'Sierra Leone',
    mapIndex: 194
  },
  {
    countryId: 151,
    name: 'El Salvador',
    mapIndex: 195
  },
  {
    countryId: 43,
    name: 'Somalia',
    mapIndex: 198
  },
  {
    countryId: 112,
    name: 'Serbia',
    mapIndex: 200
  },
  {
    countryId: 172,
    name: 'São Tomé and Principe',
    mapIndex: 201
  },
  {
    countryId: 92,
    name: 'Suriname',
    mapIndex: 202
  },
  {
    countryId: 128,
    name: 'Slovakia',
    mapIndex: 203
  },
  {
    countryId: 152,
    name: 'Slovenia',
    mapIndex: 204
  },
  {
    countryId: 56,
    name: 'Sweden',
    mapIndex: 205
  },
  {
    countryId: 155,
    name: 'Swaziland',
    mapIndex: 206
  },
  {
    countryId: 180,
    name: 'Seychelles',
    mapIndex: 208
  },
  {
    countryId: 88,
    name: 'Syria',
    mapIndex: 209
  },
  {
    countryId: 21,
    name: 'Chad',
    mapIndex: 211
  },
  {
    countryId: 124,
    name: 'Togo',
    mapIndex: 212
  },
  {
    countryId: 51,
    name: 'Thailand',
    mapIndex: 213
  },
  {
    countryId: 95,
    name: 'Tajikistan',
    mapIndex: 214
  },
  {
    countryId: 53,
    name: 'Turkmenistan',
    mapIndex: 215
  },
  {
    countryId: 156,
    name: 'Timor-Leste',
    mapIndex: 216
  },
  {
    countryId: 174,
    name: 'Tonga',
    mapIndex: 217
  },
  {
    countryId: 166,
    name: 'Trinidad and Tobago',
    mapIndex: 218
  },
  {
    countryId: 91,
    name: 'Tunisia',
    mapIndex: 219
  },
  {
    countryId: 37,
    name: 'Turkey',
    mapIndex: 220
  },
  {
    countryId: 136,
    name: 'Taiwan',
    mapIndex: 221
  },
  {
    countryId: 31,
    name: 'Tanzania',
    mapIndex: 222
  },
  {
    countryId: 80,
    name: 'Uganda',
    mapIndex: 223
  },
  {
    countryId: 46,
    name: 'Ukraine',
    mapIndex: 224
  },
  {
    countryId: 90,
    name: 'Uruguay',
    mapIndex: 225
  },
  {
    countryId: 4,
    name: 'United States',
    mapIndex: 226
  },
  {
    countryId: 57,
    name: 'Uzbekistan',
    mapIndex: 227
  },
  {
    countryId: 185,
    name: 'St. Vin. and Gren.',
    mapIndex: 229
  },
  {
    countryId: 33,
    name: 'Venezuela',
    mapIndex: 230
  },
  {
    countryId: 67,
    name: 'Vietnam',
    mapIndex: 233
  },
  {
    countryId: 159,
    name: 'Vanuatu',
    mapIndex: 234
  },
  {
    countryId: 168,
    name: 'Samoa',
    mapIndex: 236
  },
  {
    countryId: 50,
    name: 'Yemen',
    mapIndex: 237
  },
  {
    countryId: 25,
    name: 'South Africa',
    mapIndex: 238
  },
  {
    countryId: 39,
    name: 'Zambia',
    mapIndex: 239
  },
  {
    countryId: 61,
    name: 'Zimbabwe',
    mapIndex: 240
  }
];

const getMapIndexFromCountryId = id => {
  const result = countries.find(country => country.countryId === id);
  return result.mapIndex;
};

const getCountryNameFromCountryId = id => {
  const result = countries.find(country => country.countryId === id);
  return result.name;
};

module.exports = {
  getMapIndexFromCountryId: getMapIndexFromCountryId,
  getCountryNameFromCountryId: getCountryNameFromCountryId
}