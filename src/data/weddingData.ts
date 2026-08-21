import type { WeddingSiteConfig } from '../types/wedding'

import coupleImg from '../assets/couple_image/couple.png'
import originalCardImg from '../../Card/a45d3dae-4b4b-4761-ace0-49c629b52d58.png'

import gorentakuImg from '../assets/aestatics/gorentaku.jpg'
import vrathamImg from '../assets/aestatics/vratham.jpg'
import kanyadanamImg from '../assets/aestatics/kalysdhanam.jpg'
import eadurukoluImg from '../assets/aestatics/eadurukolu.jpg'
import jeelakarraBellamImg from '../assets/aestatics/Jeelakarra Bellam.jpg'
import mangalyadharanaImg from '../assets/aestatics/mangalyadharana.jpg'
import varamaluImg from '../assets/aestatics/varamalu.jpg'
import thalambraluImg from '../assets/aestatics/thalambraly.jpg'
import sapthipadhiImg from '../assets/aestatics/sapthipadhi.jpg'

import seethaKalyanamAudio from '../assets/audio/Seetha Kalyanam.weba'

export const weddingData: WeddingSiteConfig = {
  couple: {
    groom: {
      titleEn: 'Chy. :',
      titleTe: 'వరుడు : చౌ॥',
      nameEn: 'Mohan Praneeth',
      nameTe: 'మోహన్ ప్రణీత్',
      parentDetailsEn: 'Only son of Sri Turupada Rama Krishna & Smt. Visalakshi',
      parentDetailsTe: 'శ్రీ తురుపాడ రామకృష్ణ & శ్రీమతి విశాలాక్షి దంపతుల ఏకైక సుపుత్రుడు',
      hometownEn: 'Visakhapatnam & Hyderabad',
      hometownTe: 'విశాఖపట్నం & హైదరాబాద్',
    },
    bride: {
      titleEn: 'Chy. La. Sow. :',
      titleTe: 'వధువు : చౌ॥లా॥సౌ॥',
      nameEn: 'Leepika',
      nameTe: 'లీపిక',
      parentDetailsEn: 'Only daughter of Sri Bangari R. Sunil Kumar & (Late Smt. Navaneetha)',
      parentDetailsTe: 'హైదరాబాద్ వాసులు శ్రీ బంగారి ఆర్. సునీల్ కుమార్ గారి ఏకైక పుత్రిక',
      hometownEn: 'Hyderabad',
      hometownTe: 'హైదరాబాద్',
    },
    namesCombinedEn: 'Mohan Praneeth & Leepika',
    namesCombinedTe: 'మోహన్ ప్రణీత్ & లీపిక',
    shortNamesEn: 'Mohan & Leepika',
    shortNamesTe: 'మోహన్ & లీపిక',
    familyHeaderEn: 'Turupada Family · Wedding Invitation',
    familyHeaderTe: 'తురుపాడ వారి పెండ్లి పిలుపు',
    sanskritHeader: '|| శ్రీ గణేశాయ నమః · శ్రీ లక్ష్మీ నమః · శ్రీ వేంకటేశాయ నమః ||',
    sanskritHeaderTe: '|| శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు ||',
    taglineEn: 'A timeless celebration of sacred customs, uniting two souls in eternal companionship, love, and dharma.',
    taglineTe: 'తెలుగు వివాహ సంస్కృతి ఎంతో మహోన్నతమైనది. ప్రతి ఘట్టం వెనుక ఒక పవిత్రమైన అంతరార్థం, జీవితాంతం నిలిచే బంధానికి వేసే పటిష్టమైన పునాది దాగి ఉంది.',
    avatarImage: coupleImg,
    portraitImage: coupleImg,
    coverCardImage: originalCardImg,
  },

  parents: {
    groomFatherEn: 'Sri Turupada Rama Krishna',
    groomFatherTe: 'శ్రీ తురుపాడ రామకృష్ణ',
    groomMotherEn: 'Smt. Visalakshi',
    groomMotherTe: 'శ్రీమతి విశాలాక్షి',
    groomParentsEn: 'Sri Turupada Rama Krishna & Smt. Visalakshi',
    groomParentsTe: 'శ్రీ తురుపాడ రామకృష్ణ, శ్రీమతి విశాలాక్షి దంపతులు',
    groomParentsCityEn: 'Visakhapatnam & Hyderabad',
    groomParentsCityTe: 'విశాఖపట్నం & హైదరాబాద్',
    brideFatherEn: 'Sri Bangari R. Sunil Kumar',
    brideFatherTe: 'శ్రీ బంగారి ఆర్. సునీల్ కుమార్',
    brideMotherEn: 'Late Smt. Navaneetha',
    brideMotherTe: 'కీ॥శే॥ శ్రీమతి నవనీత',
    brideParentsEn: 'Sri Bangari R. Sunil Kumar, (Late Smt. Navaneetha)',
    brideParentsTe: 'శ్రీ బంగారి ఆర్. సునీల్ కుమార్, (కీ॥శే॥ శ్రీమతి నవనీత)',
    brideParentsCityEn: 'Hyderabad',
    brideParentsCityTe: 'హైదరాబాద్',
    ancestorsEn: 'Late Sri T. Rami Naidu & Late Sri G. Venkata Jagannadha Naidu',
    ancestorsTe: 'కీ॥శే॥ తురుపాడ రామినాయుడు, కీ॥శే॥ గుంట్రెడ్డి వెంకట జగన్నాధ నాయుడు గార్ల ఆశీస్సులతో...',
  },

  muhurtham: {
    dateTime: new Date('2026-08-22T23:59:00+05:30'),
    dateStringEn: 'Saturday · 22nd August 2026',
    dateStringTe: 'తే 22-08-2026 శనివారం',
    timeStringEn: 'Night 11:59 hrs',
    timeStringTe: 'రాత్రి గం॥ 11:59 ని॥లకు',
    thithiEn: 'Śrāvaṇa Śuddha Daśami',
    thithiTe: 'శ్రావణ శుద్ధ దశమి',
    nakshatramEn: 'Mūla Nakshatram',
    nakshatramTe: 'మూలా నక్షత్రయుక్త',
    lagnamEn: 'Mēṣa Lagnam',
    lagnamTe: 'మేష లగ్న పుష్పాంశమువంద',
    fullMuhurthamAstroEn: 'Śrāvaṇa Śuddha Daśami · Mūla Nakshatram · Mēṣa Lagnam',
    fullMuhurthamAstroTe: 'శ్రావణ శుద్ధ దశమి, మూలా నక్షత్రయుక్త, మేష లగ్న పుష్పాంశమువంద',
  },

  events: [
    {
      id: 'muhurtham',
      emoji: '🪔',
      title: 'Sumuhurtham',
      titleTelugu: 'సముహూర్తం (కళ్యాణ మహోత్సవం)',
      subtitle: 'Auspicious Wedding Ceremony',
      day: 'Saturday',
      date: '22nd August 2026',
      time: 'Night 11:59 hrs',
      nakshatram: 'Śrāvaṇa Śuddha Daśami · Mūla Nakshatram · Mēṣa Lagnam',
      nakshatramTelugu: 'శ్రావణ శుద్ధ దశమి, మూలా నక్షత్రయుక్త, మేష లగ్న పుష్పాంశమువంద',
      venueName: 'I Conventions',
      venueAddress: 'Sri Devi Theatre Road, Chanda Nagar, Ameenpur, Hyderabad',
      dressCode: 'Traditional South Indian Silk / Festive Pattu Wear',
      dressCodeTelugu: 'సంప్రదాయ పట్టు వస్త్రములు',
      calendarEvent: {
        title: 'Mohan Praneeth & Leepika - Sumuhurtham (Wedding Ceremony)',
        description:
          'Auspicious Wedding Ceremony of Mohan Praneeth and Leepika. Śrāvaṇa Śuddha Daśami, Varabha Nāma Saṁvatsara, Mula Nakshatram, Mesha Lagnam.',
        location: 'I Conventions, Sri Devi Theatre Road, Chanda Nagar, Ameenpur, Hyderabad, Telangana',
        startDate: '20260822T182900Z',
        endDate: '20260822T223000Z',
      },
      mapLink: 'https://maps.google.com/?q=I+Conventions+Chanda+Nagar+Ameenpur+Hyderabad',
    },
    {
      id: 'reception',
      emoji: '🌺',
      title: 'Grand Reception',
      titleTelugu: 'రిసెప్షన్ & విందు',
      subtitle: 'Celebration of Joy & Blessings',
      day: 'Wednesday',
      date: '26th August 2026',
      time: '12:00 Noon Onwards',
      nakshatram: 'Grand Luncheon & Family Gathering',
      nakshatramTelugu: 'బంధుమిత్రుల సమక్షంలో స్నేహపూర్వక విందు',
      venueName: 'Sri Sai Surya Function Hall',
      venueAddress: 'Kommadi Junction, Srinivas Nagar, Madhuravada, Visakhapatnam',
      dressCode: 'Traditional Ethnic / Royal Formal',
      dressCodeTelugu: 'రాచరిక సాంప్రదాయ దుస్తులు',
      calendarEvent: {
        title: 'Mohan Praneeth & Leepika - Wedding Reception',
        description: 'Grand Wedding Reception celebrating Mohan Praneeth and Leepika.',
        location: 'Sri Sai Surya Function Hall, Kommadi Junction, Srinivas Nagar, Madhuravada, Visakhapatnam',
        startDate: '20260826T063000Z',
        endDate: '20260826T113000Z',
      },
      mapLink: 'https://maps.google.com/?q=Sri+Sai+Surya+Function+Hall+Madhuravada+Visakhapatnam',
    },
  ],

  venues: [
    {
      type: 'Wedding Ceremony Venue',
      typeTelugu: 'కళ్యాణవేదిక (హైదరాబాద్)',
      name: 'I Conventions',
      city: 'Hyderabad, Telangana',
      address: 'Sri Devi Theatre Road, Chanda Nagar, Ameenpur, Hyderabad - 502032',
      landmark: 'Near Sri Devi Cinema & Ameenpur Lake Junction',
      date: '22nd August 2026',
      time: 'Night 11:59 hrs',
      map: 'https://maps.google.com/?q=I+Conventions+Chanda+Nagar+Ameenpur+Hyderabad',
      icon: '🏛️',
    },
    {
      type: 'Reception & Feast Venue',
      typeTelugu: 'రిసెప్షన్ వేదిక (విశాఖపట్టణం)',
      name: 'Sri Sai Surya Function Hall',
      city: 'Visakhapatnam, Andhra Pradesh',
      address: 'Kommadi Junction, Srinivas Nagar, Madhuravada, Visakhapatnam - 530048',
      landmark: 'Opposite Kommadi Junction, NH-16 Highway',
      date: '26th August 2026',
      time: '12:00 Noon Onwards',
      map: 'https://maps.google.com/?q=Sri+Sai+Surya+Function+Hall+Madhuravada+Visakhapatnam',
      icon: '🌸',
    },
  ],

  rituals: [
    {
      id: 'gorentaku',
      number: '01',
      titleTelugu: 'గోరింటాకు',
      titleEnglish: 'Gorentaku — Auspicious Henna Ceremony',
      shloka: 'కరకమల సుందరం · సౌభాగ్య వర్ధనం',
      significanceTelugu:
        'వివాహ వేడుకల్లో గోరింటాకు ఎంతో పవిత్రమైనది. వధువు చేతులకు ఎంత ఎర్రగా పండితే, అంతటి ప్రేమానురాగాలు, అదృష్టం, ఆనందం చేకూరుతాయని పెద్దల నమ్మకం.',
      significanceEnglish:
        'The application of intricate, fragrant herbal henna on the bride’s hands and feet is an ancient Vedic tradition celebrating beauty, health, and auspicious beginnings. In Telugu culture, the deeper the reddish stain, the greater the love, prosperity, and joy between the bride and her husband.',
      culturalDetailsTelugu: [
        'మహిళలందరూ కలసి పాడే మంగళ హారతుల నడుమ సాగే వేడుక',
        'శరీరానికి చలువ చేసి మనస్సుకు ప్రశాంతతను ఇచ్చే ఆయుర్వేద సంప్రదాయం',
        'సౌభాగ్యానికి, ఆయురారోగ్యాలకు పవిత్ర సూచిక',
      ],
      culturalDetailsEnglish: [
        'Celebrated amidst traditional songs, laughter, and blessings from women of the family',
        'A natural Ayurvedic herb that cools the bride’s body and relieves wedding stress',
        'A timeless symbol of marital fortune, beauty, and emotional bonding',
      ],
      image: gorentakuImg,
    },
    {
      id: 'vratham',
      number: '02',
      titleTelugu: 'గౌరీ పూజ & వ్రతం',
      titleEnglish: 'Gauri Pooja & Vratham — Sacred Pre-Wedding Vows',
      shloka: 'సర్వమంగళ మాంగల్యే శివే సర్వార్థ సాధికే',
      significanceTelugu:
        'వివాహానికి పూర్వ రంగంగా వధూవరులు విడివిడిగా జరిపే పవిత్ర వ్రతాలు. వధువు గౌరీదేవిని, వరుడు ఇష్టదైవాన్ని పూజించి సంపూర్ణ దాంపత్య సుఖాన్ని ప్రార్థిస్తారు.',
      significanceEnglish:
        'Before proceeding to the wedding mandapam, the bride performs Gauri Pooja worshipping Goddess Gauri (symbolizing the ideal devoted wife and mother), while the groom performs sacred Vrathams to transition from bachelorhood into a responsible family life (Grihastha Ashram).',
      culturalDetailsTelugu: [
        'ఆదర్శ దాంపత్యానికి గౌరీ-శంకరుల అనుగ్రహం కోరే విశిష్ట పూజ',
        'మనస్సును, దేహాన్ని పవిత్రం చేసి పెండ్లి పీటలకు సిద్ధం చేసే క్రతువు',
        'పెద్దల సమక్షంలో జరిగే సంప్రదాయ సంకల్పం',
      ],
      culturalDetailsEnglish: [
        'Invocation of Goddess Parvati and Lord Shiva for lifelong loyalty and spiritual strength',
        'Spiritual purification ritual preparing the mind and soul for the sacred marriage rites',
        'Performed with Vedic chants under the loving guidance of parents and elders',
      ],
      image: vrathamImg,
    },
    {
      id: 'kanyadanam',
      number: '03',
      titleTelugu: 'కన్యాదానం',
      titleEnglish: 'Kanyadanam — The Sacred Entrusting of the Bride',
      shloka: 'కన్యాం విష్ణురూపాయ వరాయ ప్రతిపాదయే · బ్రహ్మలోక సమన్వితః',
      significanceTelugu:
        'తల్లిదండ్రులు తమ అపురూపమైన పుత్రికను శ్రీమహావిష్ణువు స్వరూపంగా భావించే వరుడి చేతిలో ఉంచి, ధర్మ, అర్థ, కామాలలో జీవితాంతం తోడుగా ఉంటానని ప్రమాణం చేయించుకునే పరమ పవిత్రమైన ఘట్టం. ఇది హిందూ సంస్కృతిలో అత్యున్నత దానంగా పూజింపబడుతుంది.',
      significanceEnglish:
        'The most emotional and spiritually profound ritual in Hindu matrimony. The parents place the bride’s hands into the groom’s hands over a sacred coconut and betel leaves with holy water, viewing the groom as an embodiment of Lord Vishnu. The groom vows to protect, cherish, and uphold her in Dharma (duty), Artha (prosperity), and Kama (love) for all lifetimes.',
      culturalDetailsTelugu: [
        'సనాతన ధర్మంలో అత్యంత మహోన్నతమైన, పుణ్యప్రదమైన దానంగా భావించే మహోత్సవం',
        'తల్లిదండ్రుల ఆశీస్సులతో నూతన దాంపత్యానికి శ్రీకారం చుట్టే వేళ',
        'ధర్మార్థ కామేషు నాతిచరామి అని వరుడు పెద్దల సమక్షంలో చేసే పవిత్ర ప్రమాణం',
      ],
      culturalDetailsEnglish: [
        'Regarded in Vedic scriptures as the highest and most selfless act of parental love and devotion',
        'The groom solemnly pledges to cherish her as an equal partner throughout life',
        'Blessings showered with sacred Mantrams for an auspicious and prosperous future',
      ],
      image: kanyadanamImg,
    },
    {
      id: 'eadurukolu',
      number: '04',
      titleTelugu: 'ఎదురుకోలు',
      titleEnglish: 'Edurukolu — The Grand Welcoming',
      shloka: 'అతిథి దేవో భవ · సాదర సంభాషణ',
      significanceTelugu:
        'బాజాభజంత్రీలు, పూలదండలు, మంగళ హారతులతో వధువు కుటుంబం వరుడి పరివారాన్ని సాదరంగా ఆహ్వానించి గౌరవించే ఆనందమయ ఘట్టం.',
      significanceEnglish:
        'Edurukolu marks the joyous ceremonial welcome where the bride’s family steps forward to greet the groom and his wedding procession (Baraat). Accompanied by traditional Shehnai and Nadaswaram instruments, rosewater, and auspicious Aarti, this ritual cements the bond between both families.',
      culturalDetailsTelugu: [
        'రెండు కుటుంబాల ఆత్మీయ కలయికకు తొలి మధుర ఘట్టం',
        'హాస్య చతురోక్తులు, బంధువుల కోలాహలంతో నిండిన సంబరం',
        'వరుడికి మంగళహారతులు ఇచ్చి సత్కరించే ఆచారం',
      ],
      culturalDetailsEnglish: [
        'The initial formal meeting uniting two families in mutual affection and respect',
        'Filled with cheerful playful banter, floral showering, and traditional songs',
        'Ceremonial Harathi performed to ward off negative energies before entering the mandapam',
      ],
      image: eadurukoluImg,
    },
    {
      id: 'jeelakarra-bellam',
      number: '05',
      titleTelugu: 'జీలకర్ర బెల్లం',
      titleEnglish: 'Jeelakarra Bellam — The Crown Sumuhurtham Moment',
      shloka: 'సుముహూర్తే సావధాన · చిరంజీవ సుఖీభవ',
      significanceTelugu:
        'తెలుగు వివాహ మహోత్సవంలో ఇదే అత్యంత ప్రధానమైన పవిత్ర సుముహూర్త ఘట్టం. నిర్ణయించిన శుభ ముహూర్త వేళ (రాత్రి 11:59 గంటలకు) తెర అడ్డుగా ఉండగా, వధూవరులు ఒకరి శిరస్సుపై ఒకరు జీలకర్ర-బెల్లం మిశ్రమాన్ని ఉంచుతారు. చేదు-తీపి కలగలిసిన జీవితంలో ఇద్దరి మనస్సులు విడదీయరాని విధంగా ఒకటవుతాయనేది దీని పరమార్థం.',
      significanceEnglish:
        'The absolute defining and most sacred climax of a Telugu wedding! At the precise astrological Sumuhurtham (Night 11:59 PM), while a sacred silk curtain (Therasila) still separates them, the bride and groom simultaneously place a paste of Cumin seeds (Jeelakarra) and Jaggery (Bellam) on each other’s crown (Sahasrara Chakra). The bitter cumin and sweet jaggery become indivisibly united, symbolizing that in all joys and hardships of life, their souls and destinies are fused forever.',
      culturalDetailsTelugu: [
        'సుముహూర్త నిర్ణీత క్షణంలో వివాహ బంధాన్ని సుస్థిరం చేసే పరమ పవిత్ర క్షణం',
        'తెర తొలగించి వధూవరులు తొలిసారి ఒకరినొకరు కనులారా చూసుకునే మధుర వేళ',
        'జీవితంలోని కష్టసుఖాలను సమానంగా పంచుకుంటామనే శాశ్వత ఐక్యతకు సంకేతం',
      ],
      culturalDetailsEnglish: [
        'The exact astrological moment that seals the spiritual and Vedic knot of marriage',
        'The silk curtain is lowered immediately after, allowing them to gaze upon each other as lifelong partners',
        'Symbolizes positive bio-energy transmission and psychological oneness between husband and wife',
      ],
      image: jeelakarraBellamImg,
    },
    {
      id: 'mangalyadharana',
      number: '06',
      titleTelugu: 'మాంగళ్యధారణ',
      titleEnglish: 'Mangalya Dharana — The Sacred Golden Sutram & Three Knots',
      shloka: 'మాంగల్యం తంతునానేనా మమజీవన హేతునా · కంఠే బధ్నామి శుభగే త్వం జీవ శరదాం శతమ్',
      significanceTelugu:
        'తెలుగు వివాహంలో అత్యంత దివ్యమైన, కీలకమైన ఘట్టం. వరుడు పసుపు తాడులో కోర్చిన రెండు బంగారు సూత్రాలను (తాళిబొట్లు - పుట్టినిల్లు, మెట్టినిల్లు యొక్క చిహ్నాలు) వధువు మెడలో మూడు ముళ్ళు (మనసా, వాచా, కర్మణా) వేస్తాడు. ఇది వధూవరుల మధ్య శాశ్వత ప్రేమ, రక్షణ, మరియు నూరేళ్ళ సంపూర్ణ ఆయురారోగ్యాలకు సాక్ష్యంగా నిలుస్తుంది.',
      significanceEnglish:
        'The supreme sanctification of Hindu marriage! The groom ties the sacred Mangalasutram—a turmeric-infused cord holding two auspicious golden discs (representing both the paternal home and the marital home)—around the bride’s neck with three sacred knots (signifying unity in Thought, Word, and Deed). Accompanied by the resounding chorus of Vedic chants, Shehnai, and Akshintalu showered by elders, this holy cord bestows auspiciousness, divine protection, and a vow of 100 years of blissful togetherness.',
      culturalDetailsTelugu: [
        'సనాతన హిందూ సంస్కృతిలో దాంపత్య సౌభాగ్యానికి, మంగళానికి అత్యున్నత ప్రతీక',
        'పుట్టినింటి-మెట్టినింటి అనుబంధాలను కలిపి ఉంచే రెండు పవిత్ర సువర్ణ సూత్రాలు',
        'పెద్దల ఆశీర్వచనాలతో, మంత్రోచ్ఛారణల నడుమ జరిగే అత్యంత భావోద్వేగ భరిత క్షణం',
      ],
      culturalDetailsEnglish: [
        'The three knots (Brahma, Vishnu, Maheshwara) symbolize eternal dedication through mind, speech, and action',
        'The two gold discs unite the legacy, values, and blessings of both families forever',
        'Performed amidst resounding Nadaswaram notes and showering of golden Akshintalu from all loved ones',
      ],
      image: mangalyadharanaImg,
    },
    {
      id: 'varamalu',
      number: '07',
      titleTelugu: 'వరమాల',
      titleEnglish: 'Varamala — Exchange of Floral Garlands',
      shloka: 'సమగ్ర హృదయైక్యమ్ · పరస్పర వరణం',
      significanceTelugu:
        'సుముహూర్త వేళ వధూవరులు ఒకరికొకరు సుగంధ భరిత పుష్పమాలలు సమర్పించుకుంటూ, పరస్పరం హృదయపూర్వకంగా జీవిత భాగస్వామిగా స్వీకరించే వేడుక.',
      significanceEnglish:
        'Standing face-to-face at the altar, the bride and groom garland each other with fresh, fragrant flowers. This pivotal ceremony publicly declares their mutual consent, devotion, and willingness to share all the fragrance and responsibilities of life together as equals.',
      culturalDetailsTelugu: [
        'బంధుమిత్రుల హర్షధ్వానాల నడుమ జరిగే ఉల్లాసభరిత ఘట్టం',
        'ఒకరినొకరు సమానంగా గౌరవిస్తూ ముందుకు సాగే ప్రయాణం',
        'పూల సువాసనల వలె జీవితం పరిమళించాలనే ఆకాంక్ష',
      ],
      culturalDetailsEnglish: [
        'Conducted amidst joyful cheering and clapping from family and friends',
        'Signifies mutual respect and lifelong equality in partnership',
        'A prayer that their matrimonial journey remains fragrant like fresh blossoms',
      ],
      image: varamaluImg,
    },
    {
      id: 'thalambralu',
      number: '08',
      titleTelugu: 'తలంబ్రాలు',
      titleEnglish: 'Talambralu — Sacred Shower of Pearls & Turmeric',
      shloka: 'ధాన్య లక్ష్మీ ప్రసన్నాస్తు · ఆనంద వర్షం',
      significanceTelugu:
        'ముత్యాలు, పసుపు కలిపిన అక్షతలను వధూవరులు ఒకరి తలపై ఒకరు పరస్పరం ఆనందంతో కురిపించుకునే అత్యంత మనోహరమైన, సరదాగా సాగే ఘట్టం.',
      significanceEnglish:
        'The most vibrant and cherished highlight of a Telugu wedding! The couple joyfully pours golden turmeric rice, pearls, and saffron grains over each other’s heads, starting slowly and escalating into an affectionate, celebratory shower praying for abundance, harmony, and laughter.',
      culturalDetailsTelugu: [
        'తెలుగు వివాహ సంప్రదాయంలో అత్యంత ప్రజాదరణ పొందిన ఘట్టం',
        'నవ్వులు, కేరింతలు, ఆత్మీయుల ఉత్సాహభరిత సమక్షం',
        'సుఖశాంతులు, ధనధాన్యాలతో ఇల్లు వర్ధిల్లాలనే ప్రార్థన',
      ],
      culturalDetailsEnglish: [
        'The pinnacle of joy and playful intimacy in South Indian Telugu ceremonies',
        'Surrounded by laughter and playful encouragement from both family sides',
        'An ancient Vedic prayer invoking Goddess Lakshmi for health, grains, and wealth',
      ],
      image: thalambraluImg,
    },
    {
      id: 'sapthipadhi',
      number: '09',
      titleTelugu: 'సప్తపది',
      titleEnglish: 'Saptapadi — Seven Sacred Steps Around Agni',
      shloka: 'సఖా సప్తపదా భవ · సఖ్యంతే గమేయమ్',
      significanceTelugu:
        'పవిత్ర అగ్నిహోత్రం సాక్షిగా వధూవరులు ఏడు అడుగులు వేస్తూ ఆహారం, బలం, ధనం, సుఖం, సంతానం, ఋతుధర్మాలు, ఆత్మీయ స్నేహం కోసం ప్రతిజ్ఞలు చేస్తారు.',
      significanceEnglish:
        'The most sacred and legally binding rite in Hindu matrimony. Holding hands with their garments tied together (Brahma Mudi), the couple takes seven holy steps clockwise around the sacred Agni fire, making seven lifelong promises for nutrition, strength, prosperity, joy, children, wisdom, and eternal friendship.',
      culturalDetailsTelugu: [
        'హిందూ వివాహ వ్యవస్థలో సర్వోన్నతమైన ప్రధాన వైదిక ఘట్టం',
        'మంత్రోచ్ఛారణల నడుమ దైవసాక్షిగా జరిగే వివాహ బంధం',
        'జీవితాంతం కలిసుంటామని చేసే పవిత్ర వాగ్దానం',
      ],
      culturalDetailsEnglish: [
        'The supreme Vedic ceremony where the marriage is consecrated in the presence of Fire (Agni Dev)',
        'Each step seals a specific covenant: sustenance, health, wealth, family, and spiritual harmony',
        'Culminates in the eternal blessing: "With seven steps, we have become true lifelong companions"',
      ],
      image: sapthipadhiImg,
    },
  ],

  gallery: [],

  playlist: [
    {
      id: 1,
      titleTelugu: 'శ్రీ సీతారాముల కళ్యాణం చూతము రారండి',
      titleEnglish: 'SRI SEETHA RAMULA KALYANAM',
      subtitle: '🪔 Auspicious Kalyana Vaibhogam & Sacred Shehnai',
      url: seethaKalyanamAudio,
      cover: coupleImg,
    },
  ],

  initialWishes: [
    {
      id: '1',
      name: 'Suresh & Lakshmi Turupada',
      relation: 'Paternal Uncle & Aunt',
      location: 'Dallas, USA 🇺🇸',
      message:
        'Wishing Mohan Praneeth & Leepika a lifetime of divine joy, harmony, and unbounded prosperity! Though we are celebrating from Dallas, our hearts and sacred prayers are right there at the mandapam with you. శ్రీరామచంద్రుని ఆశీస్సులు ఎల్లప్పుడూ మీకు తోడుండాలి.',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-traditional-background-music-112194.mp3',
      audioDuration: 24,
      timeAgo: 'Just now',
      likes: 28,
    },
    {
      id: '2',
      name: 'Rajesh & Meghana Guntreddi',
      relation: 'Cousins & Family',
      location: 'Visakhapatnam',
      message:
        'Heartiest congratulations to Mohan bro and Leepika vadina! Excited to celebrate the grand sangeet, sumuhurtham, and reception with everyone!',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      photoUrl: coupleImg,
      timeAgo: '2 hours ago',
      likes: 21,
    },
    {
      id: '3',
      name: 'Kavitha & Sunil Kumar Bangari',
      relation: 'Family Friends',
      location: 'Bengaluru',
      message:
        'May your holy union be blessed with eternal happiness, peace, and mutual understanding. Can’t wait for 22nd August in Hyderabad!',
      timeAgo: 'Yesterday',
      likes: 19,
    },
  ],

  compliments: {
    en: 'With best compliments from Families, Friends, and Near & Dear.',
    te: 'కుటుంబ సభ్యులు మరియు బంధుమిత్రుల హృదయపూర్వక అభినందనలతో...',
  },

  socialShare: {
    whatsappInvitationText: (url: string) =>
      `🌸 శ్రీరస్తు · శుభమస్తు · అవిఘ్నమస్తు 🌸\n\nతురుపాడ వారి పెండ్లి పిలుపు\nమోహన్ ప్రణీత్ & లీపిక ల వివాహ మహోత్సవం\n📅 తేది: 22-08-2026 రాత్రి 11:59 ని॥లకు\n📍 వేదిక: ఐ కన్వెన్షన్స్, చందానగర్, హైదరాబాద్\n\nడిజిటల్ శుభలేఖ & RSVP ఇక్కడ చూడండి:\n${url}`,
    whatsappGeneralText: (url: string) =>
      `🌸 Wedding Invitation 🌸\n\nMohan Praneeth & Leepika's Wedding Ceremony\n📅 22nd August 2026, 11:59 PM @ Hyderabad\n\nView Invitation & RSVP:\n${url}`,
  },
}
