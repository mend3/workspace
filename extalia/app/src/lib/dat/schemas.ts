import { v5 as uuidv5 } from 'uuid'
import z from 'zod'
import { columnTypes } from './columns'

export const system_headers = {
  actionname: `tag	id	type	category	cat2_cnt	c[0]	c[1]	c[2]	c[3]	c[4]	c[5]	c[6]	c[7]	c[8]	c[9]	c[10]	c[11]	c[12]	c[13]	c[14]	c[15]	c[16]	c[17]	c[18]	c[19]	c[20]	c[21]	c[22]	c[23]	c[24]	c[25]	c[26]	c[27]	c[28]	c[29]	c[30]	c[31]	c[32]	c[33]	c[34]	c[35]	c[36]	c[37]	c[38]	c[39]	c[40]	c[41]	c[42]	c[43]	c[44]	c[45]	c[46]	c[47]	c[48]	c[49]	c[50]	c[51]	c[52]	c[53]	c[54]	c[55]	c[56]	c[57]	c[58]	c[59]	c[60]	c[61]	c[62]	c[63]	c[64]	c[65]	c[66]	c[67]	c[68]	c[69]	c[70]	c[71]	c[72]	c[73]	c[74]	c[75]	c[76]	c[77]	c[78]	c[79]	c[80]	c[81]	c[82]	c[83]	c[84]	c[85]	c[86]	c[87]	c[88]	c[89]	c[90]	c[91]	c[92]	c[93]	c[94]	c[95]	c[96]	c[97]	c[98]	c[99]	c[100]	c[101]	c[102]	c[103]	c[104]	c[105]	c[106]	c[107]	c[108]	c[109]	c[110]	c[111]	c[112]	c[113]	c[114]	c[115]	c[116]	c[117]	c[118]	c[119]	c[120]	c[121]	c[122]	c[123]	c[124]	c[125]	c[126]	c[127]	c[128]	c[129]	c[130]	c[131]	c[132]	c[133]	c[134]	c[135]	c[136]	c[137]	c[138]	c[139]	c[140]	c[141]	c[142]	c[143]	c[144]	c[145]	c[146]	c[147]	c[148]	c[149]	c[150]	c[151]	c[152]	c[153]	c[154]	c[155]	c[156]	c[157]	c[158]	c[159]	c[160]	c[161]	c[162]	c[163]	c[164]	c[165]	c[166]	c[167]	c[168]	c[169]	c[170]	c[171]	c[172]	c[173]	c[174]	c[175]	c[176]	c[177]	c[178]	c[179]	c[180]	c[181]	c[182]	c[183]	c[184]	c[185]	c[186]	c[187]	c[188]	c[189]	c[190]	c[191]	c[192]	c[193]	c[194]	c[195]	c[196]	c[197]	c[198]	c[199]	c[200]	c[201]	c[202]	c[203]	c[204]	c[205]	c[206]	c[207]	c[208]	c[209]	c[210]	c[211]	c[212]	c[213]	c[214]	c[215]	c[216]	c[217]	c[218]	c[219]	c[220]	c[221]	c[222]	c[223]	c[224]	c[225]	c[226]	c[227]	c[228]	c[229]	c[230]	c[231]	c[232]	c[233]	c[234]	c[235]	c[236]	c[237]	c[238]	c[239]	c[240]	c[241]	c[242]	c[243]	c[244]	c[245]	c[246]	c[247]	c[248]	c[249]	c[250]	c[251]	c[252]	c[253]	c[254]	c[255]	c[256]	c[257]	c[258]	c[259]	c[260]	c[261]	c[262]	c[263]	c[264]	c[265]	c[266]	c[267]	c[268]	c[269]	c[270]	c[271]	c[272]	c[273]	c[274]	c[275]	c[276]	c[277]	c[278]	c[279]	c[280]	c[281]	c[282]	c[283]	c[284]	c[285]	c[286]	c[287]	c[288]	c[289]	c[290]	c[291]	c[292]	c[293]	c[294]	c[295]	c[296]	c[297]	c[298]	c[299]	c[300]	c[301]	c[302]	c[303]	c[304]	c[305]	c[306]	c[307]	c[308]	c[309]	c[310]	c[311]	c[312]	c[313]	c[314]	c[315]	c[316]	c[317]	c[318]	c[319]	c[320]	c[321]	c[322]	c[323]	c[324]	c[325]	c[326]	c[327]	c[328]	c[329]	c[330]	c[331]	c[332]	c[333]	c[334]	c[335]	c[336]	c[337]	c[338]	c[339]	c[340]	c[341]	c[342]	c[343]	c[344]	c[345]	c[346]	c[347]	c[348]	c[349]	c[350]	c[351]	c[352]	c[353]	c[354]	c[355]	c[356]	c[357]	c[358]	c[359]	c[360]	c[361]	c[362]	c[363]	c[364]	c[365]	c[366]	c[367]	c[368]	c[369]	c[370]	c[371]	c[372]	c[373]	c[374]	c[375]	c[376]	c[377]	c[378]	c[379]	c[380]	c[381]	c[382]	c[383]	c[384]	c[385]	c[386]	c[387]	c[388]	c[389]	c[390]	c[391]	c[392]	c[393]	c[394]	c[395]	c[396]	c[397]	c[398]	c[399]	c[400]	c[401]	c[402]	c[403]	c[404]	c[405]	c[406]	c[407]	c[408]	c[409]	c[410]	c[411]	c[412]	c[413]	c[414]	c[415]	c[416]	c[417]	c[418]	c[419]	c[420]	c[421]	c[422]	c[423]	c[424]	c[425]	c[426]	c[427]	c[428]	c[429]	c[430]	c[431]	c[432]	c[433]	c[434]	c[435]	c[436]	c[437]	c[438]	c[439]	c[440]	c[441]	c[442]	c[443]	c[444]	c[445]	c[446]	c[447]	c[448]	c[449]	c[450]	c[451]	c[452]	c[453]	c[454]	c[455]	c[456]	c[457]	c[458]	c[459]	c[460]	c[461]	c[462]	c[463]	c[464]	c[465]	c[466]	c[467]	c[468]	c[469]	c[470]	c[471]	c[472]	c[473]	c[474]	c[475]	c[476]	c[477]	c[478]	c[479]	c[480]	c[481]	c[482]	c[483]	c[484]	c[485]	c[486]	c[487]	c[488]	c[489]	c[490]	c[491]	c[492]	c[493]	c[494]	c[495]	c[496]	c[497]	c[498]	c[499]	c[500]	c[501]	c[502]	c[503]	c[504]	c[505]	c[506]	c[507]	c[508]	c[509]	c[510]	c[511]	c[512]	c[513]	c[514]	c[515]	c[516]	c[517]	c[518]	c[519]	c[520]	c[521]	c[522]	c[523]	c[524]	c[525]	c[526]	c[527]	c[528]	c[529]	c[530]	c[531]	c[532]	c[533]	c[534]	c[535]	c[536]	c[537]	c[538]	c[539]	c[540]	c[541]	c[542]	c[543]	c[544]	c[545]	c[546]	c[547]	c[548]	c[549]	c[550]	c[551]	c[552]	c[553]	c[554]	c[555]	c[556]	c[557]	c[558]	c[559]	c[560]	c[561]	c[562]	c[563]	c[564]	c[565]	c[566]	c[567]	c[568]	c[569]	c[570]	c[571]	c[572]	c[573]	c[574]	c[575]	c[576]	c[577]	c[578]	c[579]	c[580]	c[581]	c[582]	c[583]	c[584]	c[585]	c[586]	c[587]	c[588]	c[589]	c[590]	c[591]	c[592]	c[593]	c[594]	c[595]	c[596]	c[597]	c[598]	c[599]	c[600]	c[601]	c[602]	c[603]	c[604]	c[605]	c[606]	c[607]	c[608]	c[609]	c[610]	c[611]	c[612]	c[613]	c[614]	c[615]	c[616]	c[617]	c[618]	c[619]	c[620]	c[621]	c[622]	c[623]	c[624]	c[625]	c[626]	c[627]	c[628]	c[629]	c[630]	c[631]	c[632]	c[633]	c[634]	c[635]	c[636]	c[637]	c[638]	c[639]	c[640]	c[641]	c[642]	c[643]	c[644]	c[645]	c[646]	c[647]	c[648]	c[649]	c[650]	c[651]	c[652]	c[653]	c[654]	c[655]	c[656]	c[657]	c[658]	c[659]	c[660]	c[661]	c[662]	c[663]	c[664]	c[665]	c[666]	c[667]	c[668]	c[669]	c[670]	c[671]	c[672]	c[673]	c[674]	c[675]	c[676]	c[677]	c[678]	c[679]	c[680]	c[681]	c[682]	c[683]	c[684]	c[685]	c[686]	c[687]	c[688]	c[689]	c[690]	c[691]	c[692]	c[693]	c[694]	c[695]	c[696]	c[697]	c[698]	c[699]	c[700]	c[701]	c[702]	c[703]	c[704]	c[705]	c[706]	c[707]	c[708]	c[709]	c[710]	c[711]	c[712]	c[713]	c[714]	c[715]	c[716]	c[717]	c[718]	c[719]	c[720]	c[721]	c[722]	c[723]	c[724]	c[725]	c[726]	c[727]	c[728]	c[729]	c[730]	c[731]	c[732]	c[733]	c[734]	c[735]	c[736]	c[737]	c[738]	c[739]	c[740]	c[741]	c[742]	c[743]	c[744]	c[745]	c[746]	c[747]	c[748]	c[749]	c[750]	c[751]	c[752]	c[753]	c[754]	c[755]	c[756]	c[757]	c[758]	c[759]	c[760]	c[761]	c[762]	c[763]	c[764]	c[765]	c[766]	c[767]	c[768]	c[769]	c[770]	c[771]	cmd	icon	name	desc`,
  itemname: `id	name	add_name	description	popup	set_ids	set_bonus_desc	set_extra_id	set_extra_desc	unk[0]	unk[1]	special_enchant_amount	special_enchant_desc`,
  castlename: `nbr	tag	id	castle_name	location	desc`,
  commandname: `nbr	id	name`,
  questname: `tag_?	quest_id	quest_prog	main_name	prog_name	description	cnt1	items[0]	items[1]	items[2]	items[3]	items[4]	items[5]	items[6]	items[7]	items[8]	items[9]	items[10]	items[11]	items[12]	items[13]	cnt2	num_items[0]	num_items[1]	num_items[2]	num_items[3]	num_items[4]	num_items[5]	num_items[6]	num_items[7]	num_items[8]	num_items[9]	num_items[10]	num_items[11]	num_items[12]	num_items[13]	quest_x	quest_y	quest_z	lvl_min	lvl_max	quest_type	entity_name	get_item_in_quest	UNK_1	UNK_2	contact_npc_id	contact_npc_x	contact_npc_y	contact_npc_z	restricions	short_description	cnt3	req_class[0]	req_class[1]	req_class[2]	req_class[3]	req_class[4]	req_class[5]	req_class[6]	req_class[7]	req_class[8]	req_class[9]	req_class[10]	req_class[11]	req_class[12]	req_class[13]	req_class[14]	req_class[15]	req_class[16]	req_class[17]	req_class[18]	req_class[19]	req_class[20]	req_class[21]	req_class[22]	req_class[23]	req_class[24]	req_class[25]	req_class[26]	req_class[27]	req_class[28]	req_class[29]	req_class[30]	req_class[31]	req_class[32]	req_class[33]	req_class[34]	req_class[35]	req_class[36]	req_class[37]	req_class[38]	req_class[39]	req_class[40]	req_class[41]	req_class[42]	req_class[43]	req_class[44]	req_class[45]	req_class[46]	req_class[47]	req_class[48]	req_class[49]	req_class[50]	req_class[51]	req_class[52]	req_class[53]	req_class[54]	req_class[55]	req_class[56]	req_class[57]	req_class[58]	req_class[59]	req_class[60]	req_class[61]	req_class[62]	req_class[63]	req_class[64]	req_class[65]	req_class[66]	req_class[67]	req_class[68]	cnt4	req_item[0]	req_item[1]	req_item[2]	req_item[3]	req_item[4]	clan_pet_quest	req_quest_complete	UNK_3	area_id`,
  npcname: `id	name	description	rgb[0]	rgb[1]	rgb[2]	reserved1`,
  zonename: `nbr	zone_color_id	x_world_grid	y_world_grid	top_z	bottom_z	zone_name	coords?[0]	coords?[1]	coords?[2]	coords?[3]	coords?[4]	coords?[5]	unk01	map`,
  skillname: `id	level	name	description	desc_add1	desc_add2`,
  servername: `server_id	tag_?	server_name	server_desc`,
  symbolname: `id	filename	alias	UNK_0`,

  armorgrp: `tag	id	drop_type	drop_anim_type	drop_radius	drop_height	UNK_0	drop_mesh	drop_tex	icon[0]	icon[1]	icon[2]	icon[3]	icon[4]	icon[5]	icon[6]	icon[7]	icon[8]	durability	weight	material	crystallizable	UNK_1	body_part	m_HumnFigh_cntm	m_HumnFigh_m[0]	m_HumnFigh_m[1]	m_HumnFigh_m[2]	m_HumnFigh_m[3]	m_HumnFigh_cntt	m_HumnFigh_t[0]	m_HumnFigh_t[1]	m_HumnFigh_t[2]	m_HumnFigh_t[3]	m_HumnFigh_add_cntm	m_HumnFigh_add_m[0]	m_HumnFigh_add_m[1]	m_HumnFigh_add_m[2]	m_HumnFigh_add_m[3]	m_HumnFigh_add_cntt	m_HumnFigh_add_t[0]	m_HumnFigh_add_t[1]	m_HumnFigh_add_t[2]	m_HumnFigh_add_t[3]	f_HumnFigh_cntm	f_HumnFigh_m[0]	f_HumnFigh_m[1]	f_HumnFigh_m[2]	f_HumnFigh_m[3]	f_HumnFigh_cntt	f_HumnFigh_t[0]	f_HumnFigh_t[1]	f_HumnFigh_t[2]	f_HumnFigh_t[3]	f_HumnFigh_add_cntm	f_HumnFigh_add_m[0]	f_HumnFigh_add_m[1]	f_HumnFigh_add_m[2]	f_HumnFigh_add_m[3]	f_HumnFigh_add_cntt	f_HumnFigh_add_t[0]	f_HumnFigh_add_t[1]	f_HumnFigh_add_t[2]	f_HumnFigh_add_t[3]	m_DarkElf_cntm	m_DarkElf_m[0]	m_DarkElf_m[1]	m_DarkElf_m[2]	m_DarkElf_m[3]	m_DarkElf_cntt	m_DarkElf_t[0]	m_DarkElf_t[1]	m_DarkElf_t[2]	m_DarkElf_t[3]	m_DarkElf_add_cntm	m_DarkElf_add_m[0]	m_DarkElf_add_m[1]	m_DarkElf_add_m[2]	m_DarkElf_add_m[3]	m_DarkElf_add_cntt	m_DarkElf_add_t[0]	m_DarkElf_add_t[1]	m_DarkElf_add_t[2]	m_DarkElf_add_t[3]	f_DarkElf_cntm	f_DarkElf_m[0]	f_DarkElf_m[1]	f_DarkElf_m[2]	f_DarkElf_m[3]	f_DarkElf_cntt	f_DarkElf_t[0]	f_DarkElf_t[1]	f_DarkElf_t[2]	f_DarkElf_t[3]	f_DarkElf_add_cntm	f_DarkElf_add_m[0]	f_DarkElf_add_m[1]	f_DarkElf_add_m[2]	f_DarkElf_add_m[3]	f_DarkElf_add_cntt	f_DarkElf_add_t[0]	f_DarkElf_add_t[1]	f_DarkElf_add_t[2]	f_DarkElf_add_t[3]	m_Dorf_cntm	m_Dorf_m[0]	m_Dorf_m[1]	m_Dorf_m[2]	m_Dorf_m[3]	m_Dorf_cntt	m_Dorf_t[0]	m_Dorf_t[1]	m_Dorf_t[2]	m_Dorf_t[3]	m_Dorf_add_cntm	m_Dorf_add_m[0]	m_Dorf_add_m[1]	m_Dorf_add_m[2]	m_Dorf_add_m[3]	m_Dorf_add_cntt	m_Dorf_add_t[0]	m_Dorf_add_t[1]	m_Dorf_add_t[2]	m_Dorf_add_t[3]	f_Dorf_cntm	f_Dorf_m[0]	f_Dorf_m[1]	f_Dorf_m[2]	f_Dorf_m[3]	f_Dorf_cntt	f_Dorf_t[0]	f_Dorf_t[1]	f_Dorf_t[2]	f_Dorf_t[3]	f_Dorf_add_cntm	f_Dorf_add_m[0]	f_Dorf_add_m[1]	f_Dorf_add_m[2]	f_Dorf_add_m[3]	f_Dorf_add_cntt	f_Dorf_add_t[0]	f_Dorf_add_t[1]	f_Dorf_add_t[2]	f_Dorf_add_t[3]	m_Elf_cntm	m_Elf_m[0]	m_Elf_m[1]	m_Elf_m[2]	m_Elf_m[3]	m_Elf_cntt	m_Elf_t[0]	m_Elf_t[1]	m_Elf_t[2]	m_Elf_t[3]	m_Elf_add_cntm	m_Elf_add_m[0]	m_Elf_add_m[1]	m_Elf_add_m[2]	m_Elf_add_m[3]	m_Elf_add_cntt	m_Elf_add_t[0]	m_Elf_add_t[1]	m_Elf_add_t[2]	m_Elf_add_t[3]	f_Elf_cntm	f_Elf_m[0]	f_Elf_m[1]	f_Elf_m[2]	f_Elf_m[3]	f_Elf_cntt	f_Elf_t[0]	f_Elf_t[1]	f_Elf_t[2]	f_Elf_t[3]	f_Elf_add_cntm	f_Elf_add_m[0]	f_Elf_add_m[1]	f_Elf_add_m[2]	f_Elf_add_m[3]	f_Elf_add_cntt	f_Elf_add_t[0]	f_Elf_add_t[1]	f_Elf_add_t[2]	f_Elf_add_t[3]	m_HumnMyst_cntm	m_HumnMyst_m[0]	m_HumnMyst_m[1]	m_HumnMyst_m[2]	m_HumnMyst_m[3]	m_HumnMyst_cntt	m_HumnMyst_t[0]	m_HumnMyst_t[1]	m_HumnMyst_t[2]	m_HumnMyst_t[3]	m_HumnMyst_add_cntm	m_HumnMyst_add_m[0]	m_HumnMyst_add_m[1]	m_HumnMyst_add_m[2]	m_HumnMyst_add_m[3]	m_HumnMyst_add_cntt	m_HumnMyst_add_t[0]	m_HumnMyst_add_t[1]	m_HumnMyst_add_t[2]	m_HumnMyst_add_t[3]	f_HumnMyst_cntm	f_HumnMyst_m[0]	f_HumnMyst_m[1]	f_HumnMyst_m[2]	f_HumnMyst_m[3]	f_HumnMyst_cntt	f_HumnMyst_t[0]	f_HumnMyst_t[1]	f_HumnMyst_t[2]	f_HumnMyst_t[3]	f_HumnMyst_add_cntm	f_HumnMyst_add_m[0]	f_HumnMyst_add_m[1]	f_HumnMyst_add_m[2]	f_HumnMyst_add_m[3]	f_HumnMyst_add_cntt	f_HumnMyst_add_t[0]	f_HumnMyst_add_t[1]	f_HumnMyst_add_t[2]	f_HumnMyst_add_t[3]	m_OrcFigh_cntm	m_OrcFigh_m[0]	m_OrcFigh_m[1]	m_OrcFigh_m[2]	m_OrcFigh_m[3]	m_OrcFigh_cntt	m_OrcFigh_t[0]	m_OrcFigh_t[1]	m_OrcFigh_t[2]	m_OrcFigh_t[3]	m_OrcFigh_add_cntm	m_OrcFigh_add_m[0]	m_OrcFigh_add_m[1]	m_OrcFigh_add_m[2]	m_OrcFigh_add_m[3]	m_OrcFigh_add_cntt	m_OrcFigh_add_t[0]	m_OrcFigh_add_t[1]	m_OrcFigh_add_t[2]	m_OrcFigh_add_t[3]	f_OrcFigh_cntm	f_OrcFigh_m[0]	f_OrcFigh_m[1]	f_OrcFigh_m[2]	f_OrcFigh_m[3]	f_OrcFigh_cntt	f_OrcFigh_t[0]	f_OrcFigh_t[1]	f_OrcFigh_t[2]	f_OrcFigh_t[3]	f_OrcFigh_add_cntm	f_OrcFigh_add_m[0]	f_OrcFigh_add_m[1]	f_OrcFigh_add_m[2]	f_OrcFigh_add_m[3]	f_OrcFigh_add_cntt	f_OrcFigh_add_t[0]	f_OrcFigh_add_t[1]	f_OrcFigh_add_t[2]	f_OrcFigh_add_t[3]	m_OrcMage_cntm	m_OrcMage_m[0]	m_OrcMage_m[1]	m_OrcMage_m[2]	m_OrcMage_m[3]	m_OrcMage_cntt	m_OrcMage_t[0]	m_OrcMage_t[1]	m_OrcMage_t[2]	m_OrcMage_t[3]	m_OrcMage_add_cntm	m_OrcMage_add_m[0]	m_OrcMage_add_m[1]	m_OrcMage_add_m[2]	m_OrcMage_add_m[3]	m_OrcMage_add_cntt	m_OrcMage_add_t[0]	m_OrcMage_add_t[1]	m_OrcMage_add_t[2]	m_OrcMage_add_t[3]	f_OrcMage_cntm	f_OrcMage_m[0]	f_OrcMage_m[1]	f_OrcMage_m[2]	f_OrcMage_m[3]	f_OrcMage_cntt	f_OrcMage_t[0]	f_OrcMage_t[1]	f_OrcMage_t[2]	f_OrcMage_t[3]	f_OrcMage_add_cntm	f_OrcMage_add_m[0]	f_OrcMage_add_m[1]	f_OrcMage_add_m[2]	f_OrcMage_add_m[3]	f_OrcMage_add_cntt	f_OrcMage_add_t[0]	f_OrcMage_add_t[1]	f_OrcMage_add_t[2]	f_OrcMage_add_t[3]	Unknown_MT_cntm	Unknown_MT_m[0]	Unknown_MT_cntt	Unknown_MT_t[0]	NPC_MT_cntm	NPC_MT_m[0]	NPC_MT_cntt	NPC_MT_t[0]	ACC_MT_cntm	ACC_MT_m[0]	ACC_MT_cntt	ACC_MT_t[0]	att_eff	item_sound_cnt	item_sound[0]	item_sound[1]	item_sound[2]	item_sound[3]	drop_sound	equip_sound	UNK_2	UNK_3	armor_type	crystal_type	avoid_mod	pdef	mdef	mpbonus`,
  weapongrp: `tag	id	drop_type	drop_anim_type	drop_radius	drop_height	UNK_0	drop_meshtex[0]	drop_meshtex[1]	icon[0]	icon[1]	icon[2]	icon[3]	icon[4]	icon[5]	icon[6]	icon[7]	icon[8]	durability	weight	material	crystallizable	projectile_?	body_part	handness	mt_pair_cntm	mt_pair_m[0]	mt_pair_m[1]	mt_pair_cntt	mt_pair_t[0]	mt_pair_t[1]	mt_pair_t[2]	item_sound_cnt	item_sound[0]	item_sound[1]	item_sound[2]	item_sound[3]	drop_sound	equip_sound	effect	random_damage	patt	matt	weapon_type	crystal_type	critical	hit_mod	avoid_mod	shield_pdef	shield_rate	speed	mp_consume	SS_count	SPS_count	curvature	UNK_2	is_hero	UNK_3	effA	effB	junk1A[0]	junk1A[1]	junk1A[2]	junk1A[3]	junk1A[4]	junk1B[0]	junk1B[1]	junk1B[2]	junk1B[3]	junk1B[4]	rangeA	rangeB	junk2A[0]	junk2A[1]	junk2A[2]	junk2A[3]	junk2A[4]	junk2A[5]	junk2B[0]	junk2B[1]	junk2B[2]	junk2B[3]	junk2B[4]	junk2B[5]	junk3[0]	junk3[1]	junk3[2]	junk3[3]	icons[0]	icons[1]	icons[2]	icons[3]`,
  etcitemgrp: `tag	id	drop_type	drop_anim_type	drop_radius	drop_height	UNK_0	drop_mesh	drop_tex	icon[0]	icon[1]	icon[2]	icon[3]	icon[4]	icon[5]	icon[6]	icon[7]	icon[8]	durability	weight	material	crystallizable	type1	mesh_tex_pair_cntm	mesh_tex_pair_m[0]	mesh_tex_pair_cntt	mesh_tex_pair_t[0]	item_sound	equip_sound	stackable	family	grade`,

  classinfo: `id	name`,

  raiddata: `id	npc_id	npc_level	affiliated_area_id	loc_x	loc_y	loc_z	raid_desc`,
  mobskillanimgrp: `npc_id	skill_id	seq_name	skill_name	npc_name	npc_class`,
  entereventgrp: `id	UNK_0	skill_sound	sound_vol	sound_rad	isrise	spawn_type	effect_name	anim_name`,
  huntingzone: `id	hunting_type	level	unk_1	loc_x	loc_y	loc_z	unk_2	affiliated_area_id	name`,

  npcgrp: `tag	class	mesh	cnt_tex1	tex1[0]	tex1[1]	tex1[2]	tex1[3]	tex1[4]	cnt_tex2	tex1[0]	tex1[1]	cnt_dtab1	dtab1[0]	dtab1[1]	dtab1[2]	dtab1[3]	dtab1[4]	dtab1[5]	dtab1[6]	dtab1[7]	dtab1[8]	dtab1[9]	dtab1[10]	dtab1[11]	dtab1[12]	dtab1[13]	dtab1[14]	dtab1[15]	dtab1[16]	dtab1[17]	dtab1[18]	dtab1[19]	dtab1[20]	dtab1[21]	dtab1[22]	dtab1[23]	dtab1[24]	dtab1[25]	npc_speed	unk0_cnt	unk0_tab	cnt_snd1	snd1[0]	snd1[1]	snd1[2]	cnt_snd2	snd2[0]	snd2[1]	snd2[2]	snd2[3]	snd2[4]	cnt_snd3	snd3[0]	snd3[1]	snd3[2]	rb_effect_on	rb_effect	rb_effect_fl	unk1_cnt	unk1_tab[0]	unk1_tab[1]	unk1_tab[2]	unk1_tab[3]	unk1_tab[4]	effect	UNK_2	sound_rad	sound_vol	sound_rnd	quest_be	class_lim_?`,

  skillgrp: `skill_id	skill_level	oper_type	mp_consume	cast_range	cast_style	hit_time	is_magic	ani_char	desc	icon_name	extra_eff	is_ench	ench_skill_id	hp_consume	UNK_0	UNK_1`,
  skillsoundgrp: `skill_id	skill_level	spelleffect_sound_1	spelleffect_sound_2	spelleffect_sound_3	spelleffect_sound_vol_1	spelleffect_sound_rad_1	spelleffect_sound_vol_2	spelleffect_sound_rad_2	spelleffect_sound_vol_3	spelleffect_sound_rad_3	shoteffect_sound_1	shoteffect_sound_2	shoteffect_sound_3	shoteffect_sound_vol_1	shoteffect_sound_rad_1	shoteffect_sound_vol_2	shoteffect_sound_rad_2	shoteffect_sound_vol_3	shoteffect_sound_rad_3	expeffect_sound_1	expeffect_sound_2	expeffect_sound_3	expeffect_sound_vol_1	expeffect_sound_rad_1	expeffect_sound_vol_2	expeffect_sound_rad_2	expeffect_sound_vol_3	expeffect_sound_rad_3	mfighter_sub	ffighter_sub	mdarkelf_sub	fdarkelf_sub	mdwarf_sub	fdwarf_sub	melf_sub	felf_sub	mmagic_sub	fmagic_sub	morc_sub	forc_sub	mshaman_sub	fshaman_sub	RESERVED_sub_?	mfighter_throw	ffighter_throw	mdarkelf_throw	fdarkelf_throw	mdwarf_throw	fdwarf_throw	melf_throw	felf_throw	mmagic_throw	fmagic_throw	morc_throw	forc_throw	mshaman_throw	fshaman_throw	RESERVED_throw_?	sound_vol	sound_rad`,

  hennagrp: `id	dye_id	name	icon	symbol_add_name	symbol_add_desc`,
  recipec: `name	id_mk	id_recipe	level	id_item	count	mp_cost	success_rate	materials_cnt	materials_m[0]_id	materials_m[0]_cnt	materials_m[1]_id	materials_m[1]_cnt	materials_m[2]_id	materials_m[2]_cnt	materials_m[3]_id	materials_m[3]_cnt	materials_m[4]_id	materials_m[4]_cnt	materials_m[5]_id	materials_m[5]_cnt	materials_m[6]_id	materials_m[6]_cnt	materials_m[7]_id	materials_m[7]_cnt	materials_m[8]_id	materials_m[8]_cnt	materials_m[9]_id	materials_m[9]_cnt`,

  clientdata: `id	desc`,
  creditgrp: `id	html	image	time	align`,
  staticobject: `id	name`,
  sysstring: `id	name`,
  systemmsg: `id	UNK_0	message	group	rgba[0]	rgba[1]	rgba[2]	rgba[3]	item_sound	sys_msg_ref	UNK_1[0]	UNK_1[1]	UNK_1[2]	UNK_1[3]	UNK_1[4]	sub_msg	type`,
} as const

function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}
export const files = typedKeys(system_headers)

export function getHeader<K extends keyof typeof system_headers>(name: string): (typeof system_headers)[K] {
  return system_headers[name as K]
}

const __source = z.enum(files as [SystemFileName, ...SystemFileName[]])
const __hash = z.string()
export const rowSchema = z
  .object({
    __source,
    __hash,
    id: z.coerce.number().nullish(),
    tag: z.coerce.number().nullish(),
    nbr: z.coerce.number().nullish(),
    item_id: z.coerce.number().nullish(),
    id_item: z.coerce.number().nullish(),
    skill_id: z.coerce.number().nullish(),
    npc_id: z.coerce.number().nullish(),
    quest_id: z.coerce.number().nullish(),
    dye_id: z.coerce.number().nullish(),
    quest_prog: z.coerce.number().nullish(),
    contact_npc_id: z.coerce.number().nullish(),
    affiliated_area_id: z.coerce.number().nullish(),
    area_id: z.coerce.number().nullish(),
    id_recipe: z.coerce.number().nullish(),
    server_id: z.coerce.number().nullish(),
    set_extra_id: z.coerce.number().nullish(),
    set_ids: z.coerce
      .string()
      .transform(value => value.split(','))
      .nullish(),
  })
  .passthrough()

export const mappings: Partial<Record<SystemFileName, Record<keyof SystemRow, keyof SystemRow>>> = {
  etcitemgrp: {
    id: 'item_id',
    type1: 'item_type',
    stackable: 'consume_type',
    family: 'item_type',
    grade: 'crystal_type',
    durability: 'duration',
  },
  npcgrp: {
    tag: 'id',
  },
}

const questItems = Array.from({ length: 14 }).map((_, i) => `items[${i}]`) as Array<`items[${number}]`>
const recipeMaterials = Array.from({ length: 8 }).map(
  (_, i) => `materials_m[{${i}}]_id`,
) as Array<`materials_m[${number}]_id`>

/**
 * Maps file names to their primary key columns used for lookups.
 * Each file has an array of column names that serve as unique identifiers.
 */
export const primaryColumns = {
  itemname: ['id', 'set_ids', 'set_extra_id'],
  actionname: ['id'],
  castlename: ['id'],
  commandname: ['id'],
  npcname: ['id'],
  questname: ['quest_id', 'contact_npc_id', 'area_id', 'quest_prog', ...questItems],
  servername: ['server_id', 'server_name'],
  skillname: ['id', 'level'],
  symbolname: ['id'],
  zonename: ['nbr', 'zone_name', 'map'],

  armorgrp: ['id'],
  classinfo: ['id'],
  clientdata: ['id'],
  creditgrp: ['id'],
  entereventgrp: ['id'],
  etcitemgrp: ['id'],
  hennagrp: ['id', 'dye_id'],
  huntingzone: ['id', 'affiliated_area_id'],
  mobskillanimgrp: ['skill_id', 'npc_id'],
  npcgrp: ['tag'],
  raiddata: ['npc_id', 'affiliated_area_id'],
  recipec: ['id_recipe', 'id_item', ...recipeMaterials],
  skillgrp: ['skill_id', 'skill_level'],
  skillsoundgrp: ['skill_id', 'skill_level'],
  staticobject: ['id'],
  sysstring: ['id'],
  systemmsg: ['id'],
  weapongrp: ['id'],
} as const

export const relations: Record<SystemFileName, PKBinding[]> = {
  actionname: [],
  castlename: [],
  commandname: [],
  zonename: [],
  servername: [],
  symbolname: [],
  etcitemgrp: [{ pkField: 'id', joinField: 'id', filename: 'itemname' }],
  armorgrp: [{ pkField: 'id', joinField: 'id', filename: 'itemname' }],
  weapongrp: [{ pkField: 'id', joinField: 'id', filename: 'itemname' }],
  classinfo: [],
  huntingzone: [],
  hennagrp: [],
  clientdata: [],
  creditgrp: [],
  staticobject: [],
  sysstring: [],
  systemmsg: [],
  itemname: [
    { pkField: 'set_extra_id', joinField: 'id', filename: 'weapongrp' },
    { pkField: 'set_ids', joinField: 'id', filename: 'armorgrp' },
  ],
  questname: [
    { pkField: 'area_id', joinField: 'affiliated_area_id', filename: 'huntingzone' },
    { pkField: 'id', joinField: 'contact_npc_id', filename: 'npcgrp' },
  ],
  entereventgrp: [],
  npcgrp: [],
  npcname: [
    { pkField: 'id', joinField: 'tag', filename: 'npcgrp' },
    { pkField: 'id', joinField: 'id', filename: 'entereventgrp' },
    { pkField: 'id', joinField: 'npc_id', filename: 'raiddata' },
    { pkField: 'id', joinField: 'npc_id', filename: 'mobskillanimgrp' },
  ],
  mobskillanimgrp: [{ pkField: 'skill_id', joinField: 'id', filename: 'skillname' }],
  raiddata: [{ pkField: 'affiliated_area_id', joinField: 'affiliated_area_id', filename: 'huntingzone' }],
  skillsoundgrp: [{ pkField: 'skill_id', joinField: 'skill_id', filename: 'skillgrp' }],
  skillgrp: [],
  skillname: [{ pkField: 'skill_id', joinField: 'skill_id', filename: 'skillgrp' }],
  recipec: [
    { pkField: 'id_recipe', joinField: 'id', filename: 'itemname' },
    { pkField: 'id_item', joinField: 'id', filename: 'itemname' },
  ],
}

const table_armor =
  `item_id, name, bodypart, crystallizable, armor_type, weight, material, crystal_type, avoid_modify, duration, p_def, m_def, mp_bonus, price, crystal_count, sellable, dropable, destroyable, tradeable, item_skill_id, item_skill_lvl` as const

const table_etcitem =
  'item_id, name, crystallizable, item_type, weight, consume_type, material, crystal_type, duration, price, crystal_count, sellable, dropable, destroyable, tradeable' as const

const table_weapon =
  `item_id, name, bodypart, crystallizable, weight, soulshots, spiritshots, material, crystal_type, p_dam, rnd_dam, weaponType, critical, hit_modify, avoid_modify, shield_def, shield_def_rate, atk_speed, mp_consume, m_dam, duration, price, crystal_count, sellable, dropable, destroyable, tradeable, item_skill_id, item_skill_lvl, enchant4_skill_id, enchant4_skill_lvl, onCast_skill_id, onCast_skill_lvl, onCast_skill_chance, onCrit_skill_id, onCrit_skill_lvl, onCrit_skill_chance` as const

const table_npc =
  `id, idTemplate, name, serverSideName, title, serverSideTitle, class, collision_radius, collision_height, level, sex, type, attackrange, hp, mp, hpreg, mpreg, str, con, dex, int, wit, men, exp, sp, patk, pdef, matk, mdef, atkspd, aggro, matkspd, rhand, lhand, armor, walkspd, runspd, faction_id, faction_range, isUndead, absorb_level, absorb_type, AI` as const

const table_raidboss_spawnlist =
  `boss_id, amount, loc_x, loc_y, loc_z, heading, respawn_min_delay, respawn_max_delay, respawn_time, currentHp, currentMp` as const

const table_zone = `id, type, name, x1, y1, x2, y2, z, z2, taxById` as const

const table_skill = `class_id, skill_id, level, name, sp, min_level` as const

export const ddls = {
  armorgrp: table_armor,
  etcitemgrp: table_etcitem,
  weapongrp: table_weapon,
  npcgrp: table_npc,
  npcname: table_npc,
  raiddata: table_raidboss_spawnlist,
  huntingzone: table_zone,
  skillgrp: table_skill,
  skillname: table_skill,
  entereventgrp: table_npc,
}

export type SystemFileName = keyof typeof system_headers
type SQLFile = keyof typeof ddls
type Mappings = keyof typeof mappings
export type EnabledFiles = SystemFileName & SQLFile & Mappings
type UnpackArray<T> = T extends (infer U)[] ? U : T

/**
 * Primary Key Binding
 * @param pkField - The field to use as the primary key.
 * @param joinField - The field to use as the join key.
 * @param {SystemFileName} relation - The relation to use (file name).
 */
export type PKBinding<T extends SystemFileName = SystemFileName> = {
  pkField: string
  joinField: UnpackArray<(typeof primaryColumns)[T][number]>
  filename: T
}

export type SystemRow = z.infer<typeof rowSchema>

export interface TraversalResult {
  file: SystemFileName
  record: SystemRow
  sql: Record<string, unknown>
  related: TraversalResult[]
}

function toPascalCase(inputString: string): string {
  const words = inputString.replace(/[^a-zA-Z0-9_]+/g, '').split('_')

  const pascalCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  return pascalCaseWords.join('')
}

export const mapper = (field: string) => {
  const pascal = toPascalCase(field) as keyof typeof columnTypes
  const lowercase = pascal.toLowerCase() as Lowercase<typeof pascal>

  const hash = uuidv5(JSON.stringify({ field, pascal, lowercase }), uuidv5.URL)

  return {
    field,
    pascal,
    lowercase,
    hash,
  }
}
