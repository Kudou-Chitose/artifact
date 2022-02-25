interface IData {
    minorStat: {
        [key: string]: {
            p: number
            v: number
        }
    },
    minorKeys: string[]
    mainKeys: {
        all: string[]
        flower: string[]
        plume: string[]
        sands: string[]
        goblet: string[]
        circlet: string[]
    }
    mainStat: {
        [key: string]: number[]
    }
    mainWeight: {
        [key: string]: {
            [key: string]:{
                p: number
                v: number
            }
        }
    }
    set: string[]
    slot: string[]
    setweight:{
        [key: string]: {
            [key: string]:number
        }
    }
}

export default <IData>{
    minorStat: {
        'hp': { p: 6, v: 298.75 },
        'atk': { p: 6, v: 19.45 },
        'def': { p: 6, v: 23.15 },
        'hpp': { p: 4, v: 5.83 },
        'atkp': { p: 4, v: 5.83 },
        'defp': { p: 4, v: 7.29 },
        'em': { p: 4, v: 23.31 },
        'er': { p: 4, v: 6.48 },
        'cr': { p: 3, v: 3.89 },
        'cd': { p: 3, v: 7.77 },
    },
    minorKeys: ['hp', 'atk', 'def', 'hpp', 'atkp', 'defp', 'em', 'er', 'cr', 'cd'],
    mainKeys: {
        all: ['hp', 'atk', 'hpp', 'atkp', 'defp', 'em', 'er', 'hb', 'cr', 'cd', 'pyroDB', 'hydroDB', 'electroDB', 'anemoDB', 'cryoDB', 'geoDB', 'physicalDB'],
        flower: ['hp'],
        plume: ['atk'],
        sands: ['hpp', 'atkp', 'defp', 'em', 'er'],
        goblet: ['hpp', 'atkp', 'defp', 'em', 'pyroDB', 'hydroDB', 'electroDB', 'anemoDB', 'cryoDB', 'geoDB', 'physicalDB'],
        circlet: ['hpp', 'atkp', 'defp', 'em', 'hb', 'cr', 'cd']
    },
    mainStat: {
        'hp': [717, 920, 1123, 1326, 1530, 1733, 1936, 2139, 2342, 2545, 2749, 2952, 3155, 3358, 3561, 3764, 3967, 4171, 4374, 4577, 4780],
        'atk': [47, 60, 73, 86, 100, 113, 126, 139, 152, 166, 179, 192, 205, 219, 232, 245, 258, 272, 285, 298, 311],
        'hpp': [7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
        'atkp': [7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
        'defp': [8.7, 11.2, 13.7, 16.2, 18.6, 21.1, 23.6, 26.1, 28.6, 31.0, 33.5, 36.0, 38.5, 40.9, 43.4, 45.9, 48.4, 50.8, 53.3, 55.8, 58.3],
        'em': [28, 36, 44, 52, 60, 68, 76, 84, 91, 99, 107, 115, 123, 131, 139, 147, 155, 163, 171, 179, 187],
        'er': [7.8, 10.0, 12.2, 14.4, 16.6, 18.8, 21.0, 23.2, 25.4, 27.6, 29.8, 32.0, 34.2, 36.4, 38.6, 40.8, 43.0, 45.2, 47.4, 49.6, 51.8],
        'hb': [5.4, 6.9, 8.4, 10.0, 11.5, 13.0, 14.5, 16.1, 17.6, 19.1, 20.6, 22.1, 23.7, 25.2, 26.7, 28.2, 29.8, 31.3, 32.8, 34.3, 35.9],
        'cr': [4.7, 6.0, 7.3, 8.6, 9.9, 11.3, 12.6, 13.9, 15.2, 16.6, 17.9, 19.2, 20.5, 21.8, 23.2, 24.5, 25.8, 27.1, 28.4, 29.8, 31.1],
        'cd': [9.3, 12.0, 14.6, 17.3, 19.9, 22.5, 25.2, 27.8, 30.5, 33.1, 35.7, 38.4, 41.0, 43.7, 46.3, 49.0, 51.6, 54.2, 56.9, 59.5, 62.2],
        'pyroDB': [7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
        'hydroDB': [7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
        'electroDB': [7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
        'anemoDB': [7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
        'cryoDB': [7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
        'geoDB': [7.0, 9.0, 11.0, 12.9, 14.9, 16.9, 18.9, 20.9, 22.8, 24.8, 26.8, 28.8, 30.8, 32.8, 34.7, 36.7, 38.7, 40.7, 42.7, 44.6, 46.6],
        'physicalDB': [8.7, 11.2, 13.7, 16.2, 18.6, 21.1, 23.6, 26.1, 28.6, 31.0, 33.5, 36.0, 38.5, 40.9, 43.4, 45.9, 48.4, 50.8, 53.3, 55.8, 58.3],
    },
    mainWeight: {
        'flower':{'hp': { p: 1, v: 1 }},
        'plume':{'atk': { p: 1, v: 1 }},
        'sands':{'atkp': { p: 0.7292, v: 0.2666 },
                'hpp': { p: 0.1458, v: 0.2666 },
                'defp': { p: 0.1042, v: 0.2666 },
                'er': { p: 0.5833, v: 0.1 },
                'em': { p: 0.2292, v: 0.1 }},
        'goblet':{'atkp': { p: 0.2917, v: 0.2125 },
                'hpp': { p: 0.1250, v: 0.2125 },
                'defp': { p: 0.0833, v: 0.2 },
                'pyroDB': { p: 0.1250, v: 0.05 },
                'hydroDB': { p: 0.1250, v: 0.05 },
                'electroDB': { p: 0.1250, v: 0.05 },
                'anemoDB': { p: 0.1250, v: 0.05 },
                'cryoDB': { p: 0.1250, v: 0.05 },
                'geoDB': { p: 0.1250, v: 0.05 },
                'physicalDB': { p: 0.1250, v: 0.05 },
                'em': { p: 0.1458, v: 0.025 }},
        'circlet':{'atkp': { p: 0.1666, v: 0.22 },
                'hpp': { p: 0.1042, v: 0.22 },
                'defp': { p: 0.0833, v: 0.22 },
                'cr': { p: 0.7917, v: 0.1 },
                'cd': { p: 0.7708, v: 0.1 },
                'hb': { p: 0.1666, v: 0.1 },
                'em': { p: 0.1458, v: 0.04 }},
    },
    set:['GladiatorsFinale','WanderersTroupe','Thundersoother','ThunderingFury','MaidenBeloved','ViridescentVenerer','CrimsonWitchOfFlames','Lavawalker',
    'NoblesseOblige','BloodstainedChivalry','ArchaicPetra','RetracingBolide','BlizzardStrayer','HeartOfDepth','TenacityOfTheMillelith','PaleFlame',
    'ShimenawasReminiscence','EmblemOfSeveredFate','HuskOfOpulentDreams','OceanHuedClam'],
    slot:['flower','plume','sands','goblet','circlet'],
    setweight:{'GladiatorsFinale': {'pyroDB': -0.8671,
                    'hydroDB': -1.2681,
                    'electroDB': 1.5119,
                    'anemoDB': -0.0998,
                    'cryoDB': 1.214,
                    'geoDB': -0.7559,
                    'physicalDB': 3.4922,
                    'hpp': -3.6917,
                    'atkp': 4.1576,
                    'defp': -1.9166,
                    'em': -1.6903,
                    'er': -1.494,
                    'hb': -3.0237,
                    'cr': 3.1944,
                    'cd': 3.9887},
                'WanderersTroupe': {'pyroDB': 4.5262,
                    'hydroDB': 1.386,
                    'electroDB': 0.2217,
                    'anemoDB': -2.253,
                    'cryoDB': -1.5765,
                    'geoDB': -2.4384,
                    'physicalDB': -2.253,
                    'hpp': -0.8485,
                    'atkp': 2.4384,
                    'defp': -2.0609,
                    'em': 4.4611,
                    'er': -2.4535,
                    'hb': -2.4384,
                    'cr': 2.0609,
                    'cd': 2.7971},
                'Thundersoother': {'pyroDB': -1.0697,
                    'hydroDB': -0.711,
                    'electroDB': 4.6625,
                    'anemoDB': -0.8616,
                    'cryoDB': -1.0697,
                    'geoDB': -0.9325,
                    'physicalDB': 5.0464,
                    'hpp': -0.8616,
                    'atkp': 0.9325,
                    'defp': -0.7881,
                    'em': 0.0,
                    'er': -2.9488,
                    'hb': -0.9325,
                    'cr': 0.7881,
                    'cd': 1.0697},
                'ThunderingFury': {'pyroDB': -1.7493,
                    'hydroDB': -1.1628,
                    'electroDB': 7.6249,
                    'anemoDB': -1.409,
                    'cryoDB': -1.7493,
                    'geoDB': -1.525,
                    'physicalDB': 2.4557,
                    'hpp': -1.409,
                    'atkp': 1.525,
                    'defp': -1.2888,
                    'em': -0.682,
                    'er': -0.4822,
                    'hb': -1.525,
                    'cr': 1.2888,
                    'cd': 1.7493},
                'MaidenBeloved': {'pyroDB': -0.9177,
                    'hydroDB': 2.135,
                    'electroDB': -2.0,
                    'anemoDB': 1.3199,
                    'cryoDB': 0.4588,
                    'geoDB': -0.5,
                    'physicalDB': -1.8479,
                    'hpp': 4.4877,
                    'atkp': -4.0,
                    'defp': 0.0,
                    'em': -0.0,
                    'er': 3.1623,
                    'hb': 10.0,
                    'cr': -8.4515,
                    'cd': -7.3413},
                'ViridescentVenerer': {'pyroDB': -2.1197,
                    'hydroDB': -1.409,
                    'electroDB': -1.8479,
                    'anemoDB': 10.0,
                    'cryoDB': -2.1197,
                    'geoDB': -1.8479,
                    'physicalDB': -1.7073,
                    'hpp': -1.7073,
                    'atkp': 1.8479,
                    'defp': -1.5617,
                    'em': 2.9514,
                    'er': 1.6696,
                    'hb': 1.3199,
                    'cr': -0.2231,
                    'cd': 0.6662},
                'CrimsonWitchOfFlames': {'pyroDB': 8.0547,
                    'hydroDB': -1.409,
                    'electroDB': -1.8479,
                    'anemoDB': -1.7073,
                    'cryoDB': -2.1197,
                    'geoDB': -1.8479,
                    'physicalDB': -1.7073,
                    'hpp': -0.0348,
                    'atkp': 1.8479,
                    'defp': -1.5617,
                    'em': 4.132,
                    'er': -4.5913,
                    'hb': -1.8479,
                    'cr': 1.5617,
                    'cd': 2.1197},
                'Lavawalker': {'pyroDB': 2.914,
                    'hydroDB': -0.8805,
                    'electroDB': -1.1547,
                    'anemoDB': -1.0669,
                    'cryoDB': 0.7947,
                    'geoDB': -1.1547,
                    'physicalDB': -1.0669,
                    'hpp': -1.0669,
                    'atkp': 1.1547,
                    'defp': -0.9759,
                    'em': 2.582,
                    'er': -3.6515,
                    'hb': -1.1547,
                    'cr': 0.9759,
                    'cd': 1.3245},
                'NoblesseOblige': {'pyroDB': -2.7145,
                    'hydroDB': 1.6325,
                    'electroDB': -0.5634,
                    'anemoDB': -2.3054,
                    'cryoDB': 3.4901,
                    'geoDB': 0.5634,
                    'physicalDB': -1.1155,
                    'hpp': 0.0744,
                    'atkp': -0.5634,
                    'defp': -1.746,
                    'em': -1.2599,
                    'er': 1.7817,
                    'hb': 1.6903,
                    'cr': -0.7937,
                    'cd': -1.4219},
                'BloodstainedChivalry': {'pyroDB': -0.6662,
                    'hydroDB': -1.409,
                    'electroDB': 2.9038,
                    'anemoDB': -1.7073,
                    'cryoDB': 2.2408,
                    'geoDB': -1.8479,
                    'physicalDB': 10.0,
                    'hpp': -1.7073,
                    'atkp': 1.8479,
                    'defp': 0.2231,
                    'em': -2.9514,
                    'er': -2.087,
                    'hb': -1.8479,
                    'cr': 1.5617,
                    'cd': 2.1197},
                'ArchaicPetra': {'pyroDB': -1.9389,
                    'hydroDB': -1.2888,
                    'electroDB': -1.6903,
                    'anemoDB': -1.5617,
                    'cryoDB': -1.9389,
                    'geoDB': 8.4515,
                    'physicalDB': -1.5617,
                    'hpp': 0.2231,
                    'atkp': -1.6903,
                    'defp': 4.2857,
                    'em': -2.5198,
                    'er': -1.3363,
                    'hb': 0.0,
                    'cr': 1.4286,
                    'cd': 0.3878},
                'RetracingBolide': {'pyroDB': 5.8168,
                    'hydroDB': -1.2888,
                    'electroDB': -1.6903,
                    'anemoDB': -1.5617,
                    'cryoDB': -1.9389,
                    'geoDB': 0.0,
                    'physicalDB': 0.2231,
                    'hpp': 0.2231,
                    'atkp': -0.0,
                    'defp': 2.381,
                    'em': 1.2599,
                    'er': -2.6726,
                    'hb': -1.6903,
                    'cr': 1.4286,
                    'cd': 1.9389},
                'BlizzardStrayer': {'pyroDB': -1.9389,
                    'hydroDB': -1.2888,
                    'electroDB': -1.6903,
                    'anemoDB': -1.5617,
                    'cryoDB': 7.3679,
                    'geoDB': -1.6903,
                    'physicalDB': 2.0079,
                    'hpp': -1.5617,
                    'atkp': 1.6903,
                    'defp': -1.4286,
                    'em': -1.2599,
                    'er': -0.0,
                    'hb': -1.6903,
                    'cr': 1.4286,
                    'cd': 1.9389},
                'HeartOfDepth': {'pyroDB': -1.5467,
                    'hydroDB': 8.842,
                    'electroDB': -1.3484,
                    'anemoDB': -1.2458,
                    'cryoDB': -1.5467,
                    'geoDB': -1.3484,
                    'physicalDB': -1.2458,
                    'hpp': 0.8899,
                    'atkp': 1.3484,
                    'defp': -1.1396,
                    'em': 3.0151,
                    'er': 0.533,
                    'hb': 0.6742,
                    'cr': -1.1396,
                    'cd': -0.3093},
                'TenacityOfTheMillelith': {'pyroDB': 0.8645,
                    'hydroDB': 3.0087,
                    'electroDB': -1.1084,
                    'anemoDB': -2.253,
                    'cryoDB': -0.356,
                    'geoDB': 0.2217,
                    'physicalDB': 0.5559,
                    'hpp': 6.1737,
                    'atkp': -2.8818,
                    'defp': 0.9368,
                    'em': -1.487,
                    'er': 0.701,
                    'hb': 2.8818,
                    'cr': -3.9344,
                    'cd': -3.3056},
                'PaleFlame': {'pyroDB': -0.6662,
                    'hydroDB': -1.409,
                    'electroDB': 2.9038,
                    'anemoDB': -1.7073,
                    'cryoDB': 2.2408,
                    'geoDB': -1.8479,
                    'physicalDB': 10.0,
                    'hpp': -1.7073,
                    'atkp': 1.8479,
                    'defp': 0.2231,
                    'em': -2.9514,
                    'er': -2.087,
                    'hb': -1.8479,
                    'cr': 1.5617,
                    'cd': 2.1197},
                'ShimenawasReminiscence': {'pyroDB': 0.3878,
                    'hydroDB': -1.117,
                    'electroDB': 1.6903,
                    'anemoDB': 0.0744,
                    'cryoDB': 0.3878,
                    'geoDB': -1.6903,
                    'physicalDB': 2.4542,
                    'hpp': -2.3054,
                    'atkp': 5.0709,
                    'defp': -3.0159,
                    'em': -0.42,
                    'er': -1.7817,
                    'hb': -2.8172,
                    'cr': 3.0159,
                    'cd': 3.7486},
                'EmblemOfSeveredFate': {'pyroDB': -1.8543,
                    'hydroDB': 0.1761,
                    'electroDB': 2.3094,
                    'anemoDB': -3.2006,
                    'cryoDB': 3.4438,
                    'geoDB': -1.1547,
                    'physicalDB': -0.762,
                    'hpp': -1.9813,
                    'atkp': -0.0,
                    'defp': -0.3253,
                    'em': 0.0,
                    'er': 3.6515,
                    'hb': -1.1547,
                    'cr': 1.6265,
                    'cd': -0.2649},
                'HuskOfOpulentDreams': {'pyroDB': -0.3878,
                    'hydroDB': -1.2888,
                    'electroDB': -1.6903,
                    'anemoDB': -1.5617,
                    'cryoDB': -1.9389,
                    'geoDB': 6.7612,
                    'physicalDB': 0.2231,
                    'hpp': -1.5617,
                    'atkp': -5.0709,
                    'defp': 10.0,
                    'em': -1.2599,
                    'er': 1.3363,
                    'hb': 0.0,
                    'cr': 1.4286,
                    'cd': -1.1634},
                'OceanHuedClam': {'pyroDB': -0.9177,
                    'hydroDB': 2.135,
                    'electroDB': -2.0,
                    'anemoDB': 1.3199,
                    'cryoDB': 0.4588,
                    'geoDB': -0.5,
                    'physicalDB': -1.8479,
                    'hpp': 4.4877,
                    'atkp': -4.0,
                    'defp': 0.0,
                    'em': -0.0,
                    'er': 3.1623,
                    'hb': 10.0,
                    'cr': -8.4515,
                    'cd': -7.3413}}
}