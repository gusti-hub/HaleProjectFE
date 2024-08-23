import { Dialog } from '@material-tailwind/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { backendServer } from '../utils/info';
import toast from 'react-hot-toast';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import GlobalVariable from '../utils/GlobalVariable';
import Equipment from './furnishing/equipment';
import Hardware from './furnishing/hardware';
import Accessory from './furnishing/accessory';
import Artwork from './furnishing/artwork';
import Casegood from './furnishing/casegood';
import Fabric from './furnishing/fabric';
import Arearug from './furnishing/arearug';
import Hardwired from './furnishing/lightfixture';
import DecorativeLighting from './furnishing/decoretivelighting';
import Mirror from './furnishing/mirror';
import Miscellaneous from './furnishing/miscellaneous';
import Seating from './furnishing/seating';
import Wallpaper from './furnishing/wallpaper';
import Upholstery from './furnishing/upholstery';
import WindowTreatment from './furnishing/windowtreatment';
import Table from './furnishing/table';
import ViewHardware from './view/hardware';
import ViewArtwork from './view/artwork';
import ViewCasegood from './view/casegood';
import ViewAcessory from './view/accessory';
import ViewArearug from './view/arearug';
import ViewEquipment from './view/equipment';
import ViewFabric from './view/fabric';
import ViewHardwired from './view/lightfixture';
import ViewDecorativeLighting from './view/decoretivelighting';
import ViewMirror from './view/mirror';
import ViewMiscellaneous from './view/miscellaneous';
import ViewTable from './view/table';
import ViewSeating from './view/seating';
import ViewWallpaper from './view/wallpaper';
import ViewUpholstery from './view/upholstery';
import ViewWindowTreatment from './view/windowtreatment';

const RefForm = ({ id, fetchDetails, handleClose, editItem, isEditMode }) => {
    const initialFormData = isEditMode ? editItem : { projectId: id, type: 'Reference', title: '', desc: '' };
    const [formData, setFormData] = useState(initialFormData);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(isEditMode ? editItem.imageUrl : '');
    const [fileName, setFileName] = useState(isEditMode ? editItem.imageUrl.split('/').pop() : '');

    useEffect(() => {
        if (isEditMode) {
            setImageUrl(editItem.imageUrl);
            setFileName(editItem.imageUrl.split('/').pop());
        }
    }, [isEditMode, editItem]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    const resetForm = () => {
        setFormData({ projectId: id, type: 'Reference', title: '', desc: '' });
        setSelectedFile(null);
        setImageUrl('');
        setFileName('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpload = async () => {
        if (!selectedFile) return imageUrl;

        const uploadData = new FormData();
        uploadData.append('image', selectedFile);

        try {
            const response = await axios.post(`${backendServer}/api/upload`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.title.length === 0 || formData.desc.length === 0 || (!isEditMode && !selectedFile)) {
            toast.error("Fill the mandatory fields!");
            handleClose();
        } else {
            try {
                const uploadedImageUrl = await handleUpload();

                if (!uploadedImageUrl) return;

                const finalFormData = { ...formData, imageUrl: uploadedImageUrl };

                if (isEditMode) {
                    const response = await axios.put(`${backendServer}/api/product/${formData._id}`, finalFormData);
                    toast.success(response.data.message);
                } else {
                    const response = await axios.post(`${backendServer}/api/newProduct`, finalFormData);
                    toast.success(response.data.message);
                }
                handleClose();
                fetchDetails();
                resetForm();
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-start gap-2 text-black">
                <label htmlFor="title">Title:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <input value={formData.title} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='title' placeholder='Type here...' />
            </div>
            <div className="w-full flex items-start justify-start gap-2 text-black">
                <label htmlFor="desc">Description:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <textarea value={formData.desc} onChange={handleInputChange}
                    className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                    name="desc" rows="2" placeholder='Type here...'></textarea>
            </div>
            <div className="w-full flex items-start justify-start gap-2 text-black">
                <label htmlFor="file">Attachment:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <input className='w-fit' type="file" onChange={handleFileChange} name='file' />
            </div>
            {fileName && <div className="w-full text-left text-sm">Uploaded file: {fileName}</div>}
            <button type="submit" className='w-full p-1.5 rounded-lg bg-[#7F55DE] text-white font-medium'>
                {isEditMode ? 'Update Item' : 'Add Item'}
            </button>
        </form>
    );
};

const PdtForm = ({ id, fetchDetails, handleClose, editItem, isEditMode, client, secName, ConfigurationType, products, addressID }) => {
    const token = localStorage.getItem('token');

    const initialFormData = isEditMode && editItem ? {
        projectId: id,
        type: 'Product',
        name: editItem.title || '',
        code: editItem.productDetails?.code || '',
        furnishing: editItem.furnishing || '',
        qty: editItem.qty || '',
        sku: editItem.sku || '',
        imageUrl: editItem.imageUrl || '',
        vendor : editItem.vendor || '',
        rfq : editItem.rfq || '',
        net_cost : editItem.net_cost || '',
        shipping_cost : editItem.shipping_cost || '',
        other_cost : editItem.other_cost || '',
        po_amount : editItem.po_amount || '',
        buy_tax : editItem.buy_tax || '',
        buy_sales_tax : editItem.buy_sales_tax || '',
        sell_markup : editItem.sell_markup || '',
        client_product_cost : editItem.client_product_cost || '',
        client_price : editItem.client_price || '',
        sell_tax : editItem.sell_tax || '',
        sell_sales_tax : editItem.sell_sales_tax || '',
        

        
        //Accessory
        acessory_unit: editItem.productDetails?.acessory_unit || '',
        acessory_len: editItem.productDetails?.acessory_len || '',
        acessory_wid: editItem.productDetails?.acessory_wid || '',
        acessory_height: editItem.productDetails?.acessory_height || '',
        acessory_color: editItem.productDetails?.acessory_color || '',
        acessory_finish: editItem.productDetails?.acessory_finish || '',

        //Area Rug
        arearug_unit: editItem.productDetails?.arearug_unit || '',
        arearug_len: editItem.productDetails?.arearug_len || '',
        arearug_wid: editItem.productDetails?.arearug_wid || '',
        arearug_rugpad: editItem.productDetails?.arearug_rugpad || '',
        arearug_content: editItem.productDetails?.arearug_content || '',
        arearug_custom: editItem.productDetails?.arearug_custom || '',
        arearug_color: editItem.productDetails?.arearug_color || '',
        arearug_gauge: editItem.productDetails?.arearug_gauge || '',
        arearug_pile: editItem.productDetails?.arearug_pile || '',
        arearug_stitches: editItem.productDetails?.arearug_stitches || '',
        arearug_pattern: editItem.productDetails?.arearug_pattern || '',
        arearug_construction: editItem.productDetails?.arearug_construction || '',
        arearug_backing: editItem.productDetails?.arearug_backing || '',
        arearug_secondaryBacking: editItem.productDetails?.arearug_secondaryBacking || '',

        //Equipment
        equipment_unit: editItem.productDetails?.equipment_unit || '',
        equipment_len: editItem.productDetails?.equipment_len || '',
        equipment_wid: editItem.productDetails?.equipment_wid || '',
        equipment_height: editItem.productDetails?.equipment_height || '',
        equipment_color: editItem.productDetails?.equipment_color || '',
        equipment_finish: editItem.productDetails?.equipment_finish || '',

        //Hardware
        hardware_unit: editItem.productDetails?.hardware_unit || '',
        hardware_len: editItem.productDetails?.hardware_len || '',
        hardware_wid: editItem.productDetails?.hardware_wid || '',
        hardware_height: editItem.productDetails?.hardware_height || '',
        hardware_color: editItem.productDetails?.hardware_color || '',
        hardware_finish: editItem.productDetails?.hardware_finish || '',


        //Artwork
        artwork_unit: editItem.productDetails?.artwork_unit || '',
        len_overall: editItem.productDetails?.len_overall || '',
        wid_overall: editItem.productDetails?.wid_overall || '',
        height_overall: editItem.productDetails?.height_overall || '',
        wid_frame: editItem.productDetails?.wid_frame || '',
        height_frame: editItem.productDetails?.height_frame || '',
        len_artwork: editItem.productDetails?.len_artwork || '',
        wid_artwork: editItem.productDetails?.wid_artwork || '',
        medium: editItem.productDetails?.medium || '',
        frame_item: editItem.productDetails?.frame_item || '',
        frame_material: editItem.productDetails?.frame_material || '',
        frame_finish: editItem.productDetails?.frame_finish || '',
        mat_color: editItem.productDetails?.mat_color || '',
        mat_size: editItem.productDetails?.mat_size || '',
        orientation: editItem.productDetails?.orientation || '',
        glass: editItem.productDetails?.glass || '',
        mounting_hardware: editItem.productDetails?.mounting_hardware || '',

        //Casegood
        casegood_unit: editItem.productDetails?.casegood_unit || '',
        casegood_len: editItem.productDetails?.casegood_len || '',
        casegood_wid: editItem.productDetails?.casegood_wid || '',
        casegood_height: editItem.productDetails?.casegood_height || '',
        casegood_top: editItem.productDetails?.casegood_top || '',
        casegood_finish: editItem.productDetails?.casegood_finish || '',
        casegood_outlet: editItem.productDetails?.casegood_outlet || '',
        casegood_hardware: editItem.productDetails?.casegood_hardware || '',
        casegood_installation_type: editItem.productDetails?.casegood_installation_type || '',

        //fabric
        fabric_color: editItem.productDetails?.fabric_color || '',
        fabric_unit: editItem.productDetails?.fabric_unit || '',
        fabric_width: editItem.productDetails?.fabric_width || '',
        fabric_horizontal: editItem.productDetails?.fabric_horizontal || '',
        fabric_vertical: editItem.productDetails?.fabric_vertical || '',
        fabric_content: editItem.productDetails?.fabric_content || '',
        fabric_backing: editItem.productDetails?.fabric_backing || '',
        fabric_cfa_required: editItem.productDetails?.fabric_cfa_required || '',
        fabric_cfa_waived: editItem.productDetails?.fabric_cfa_waived || '',


        //Handwired
        hardwired_unit: editItem.productDetails?.hardwired_unit || '',
        hardwired_len_overall: editItem.productDetails?.hardwired_len_overall || '',
        hardwired_wid_overall: editItem.productDetails?.hardwired_wid_overall || '',
        hardwired_height_overall: editItem.productDetails?.hardwired_height_overall || '',
        hardwired_len_fixture: editItem.productDetails?.hardwired_len_fixture || '',
        hardwired_wid_fixture: editItem.productDetails?.hardwired_wid_fixture || '',
        hardwired_height_fixture: editItem.productDetails?.hardwired_height_fixture || '',
        hardwired_len_shade: editItem.productDetails?.hardwired_len_shade || '',
        hardwired_wid_shade: editItem.productDetails?.hardwired_wid_shade || '',
        hardwired_height_shade: editItem.productDetails?.hardwired_height_shade || '',
        hardwired_color: editItem.productDetails?.hardwired_color || '',
        hardwired_finish: editItem.productDetails?.hardwired_finish || '',
        hardwired_base_material: editItem.productDetails?.hardwired_base_material || '',
        hardwired_shade_material: editItem.productDetails?.hardwired_shade_material || '',
        hardwired_shade_type: editItem.productDetails?.hardwired_shade_type || '',
        hardwired_switch_type: editItem.productDetails?.hardwired_switch_type || '',
        hardwired_quantity: editItem.productDetails?.hardwired_quantity || '',
        hardwired_socket_type: editItem.productDetails?.hardwired_socket_type || '',
        hardwired_dimmable: editItem.productDetails?.hardwired_dimmable || '',
        hardwired_switch: editItem.productDetails?.hardwired_switch || '',
        hardwired_wattaga: editItem.productDetails?.hardwired_wattaga || '',
        hardwired_temperature: editItem.productDetails?.hardwired_temperature || '',
        hardwired_rating: editItem.productDetails?.hardwired_rating || '',
        hardwired: editItem.productDetails?.hardwired || '',

        //Decorative Lighting
        decorative_lighting_unit: editItem.productDetails?.decorative_lighting_unit || '',
        decorative_lighting_len_overall: editItem.productDetails?.decorative_lighting_len_overall || '',
        decorative_lighting_wid_overall: editItem.productDetails?.decorative_lighting_wid_overall || '',
        decorative_lighting_height_overall: editItem.productDetails?.decorative_lighting_height_overall || '',
        decorative_lighting_len_fixture: editItem.productDetails?.decorative_lighting_len_fixture || '',
        decorative_lighting_wid_fixture: editItem.productDetails?.decorative_lighting_wid_fixture || '',
        decorative_lighting_height_fixture: editItem.productDetails?.decorative_lighting_height_fixture || '',
        decorative_lighting_len_shade: editItem.productDetails?.decorative_lighting_len_shade || '',
        decorative_lighting_wid_shade: editItem.productDetails?.decorative_lighting_wid_shade || '',
        decorative_lighting_height_shade: editItem.productDetails?.decorative_lighting_height_shade || '',
        decorative_lighting_color: editItem.productDetails?.decorative_lighting_color || '',
        decorative_lighting_finish: editItem.productDetails?.decorative_lighting_finish || '',
        decorative_lighting_base_material: editItem.productDetails?.decorative_lighting_base_material || '',
        decorative_lighting_shade_material: editItem.productDetails?.decorative_lighting_shade_material || '',
        decorative_lighting_shade_type: editItem.productDetails?.decorative_lighting_shade_type || '',
        decorative_lighting_switch_type: editItem.productDetails?.decorative_lighting_switch_type || '',
        decorative_lighting_quantity: editItem.productDetails?.decorative_lighting_quantity || '',
        decorative_lighting_socket_type: editItem.productDetails?.decorative_lighting_socket_type || '',
        decorative_lighting_dimmable: editItem.productDetails?.decorative_lighting_dimmable || '',
        decorative_lighting_switch: editItem.productDetails?.decorative_lighting_switch || '',
        decorative_lighting_wattaga: editItem.productDetails?.decorative_lighting_wattaga || '',
        decorative_lighting_temperature: editItem.productDetails?.decorative_lighting_temperature || '',
        decorative_lighting_rating: editItem.productDetails?.decorative_lighting_rating || '',

        //Mirror
        mirror_unit: editItem.productDetails?.mirror_unit || '',
        mirror_len: editItem.productDetails?.mirror_len || '',
        mirror_wid: editItem.productDetails?.mirror_wid || '',
        mirror_height: editItem.productDetails?.mirror_height || '',
        mirror_color: editItem.productDetails?.mirror_color || '',
        mirror_finish: editItem.productDetails?.mirror_finish || '',
        mirror_orientation: editItem.productDetails?.mirror_orientation || '',
        mirror_glass: editItem.productDetails?.mirror_glass || '',
        mirror_mounting_hardware: editItem.productDetails?.mirror_mounting_hardware || '',

        //Miscellaneous
        miscellaneous_fabrication_style: editItem.productDetails?.miscellaneous_fabrication_style || '',
        miscellaneous_pattern: editItem.productDetails?.miscellaneous_pattern || '',
        miscellaneous_insert: editItem.productDetails?.miscellaneous_insert || '',
        
        //Table
        table_unit: editItem.productDetails?.table_unit || '',
        table_len: editItem.productDetails?.table_len || '',
        table_wid: editItem.productDetails?.table_wid || '',
        table_height: editItem.productDetails?.table_height || '',
        table_other_dimension: editItem.productDetails?.table_other_dimension || '',
        table_top: editItem.productDetails?.table_top || '',
        table_finish: editItem.productDetails?.table_finish || '',
        table_hardware: editItem.productDetails?.table_hardware || '',

        //Seating
        seating_unit: editItem.productDetails?.seating_unit || '',
        seating_len: editItem.productDetails?.seating_len || '',
        seating_wid: editItem.productDetails?.seating_wid || '',
        seating_height: editItem.productDetails?.seating_height || '',
        seating_color: editItem.productDetails?.seating_color || '',
        seating_finish: editItem.productDetails?.seating_finish || '',
        seating_vendor_provided_fabric: editItem.productDetails?.seating_vendor_provided_fabric || '',
        seating_fabric: editItem.productDetails?.seating_fabric || '',
        seating_com_fabric: editItem.productDetails?.seating_com_fabric || '',
        seating_pattern_name: editItem.productDetails?.seating_pattern_name || '',
        seating_sku: editItem.productDetails?.seating_sku || '',
        seating_width: editItem.productDetails?.seating_width || '',
        seating_horizontal: editItem.productDetails?.seating_horizontal || '',
        seating_vertical: editItem.productDetails?.seating_vertical || '',
        seating_content: editItem.productDetails?.seating_content || '',
        seating_backing: editItem.productDetails?.seating_backing || '',
        seating_qty: editItem.productDetails?.seating_qty || '',

        //wallpaper
        wallpaper_color: editItem.productDetails?.wallpaper_color || '',
        wallpaper_unit: editItem.productDetails?.wallpaper_unit || '',
        wallpaper_width: editItem.productDetails?.wallpaper_width || '',
        wallpaper_horizontal: editItem.productDetails?.wallpaper_horizontal || '',
        wallpaper_vertical: editItem.productDetails?.wallpaper_vertical || '',
        wallpaper_content: editItem.productDetails?.wallpaper_content || '',
        wallpaper_type: editItem.productDetails?.wallpaper_type || '',
        wallpaper_weight: editItem.productDetails?.wallpaper_weight || '',
        wallpaper_backing: editItem.productDetails?.wallpaper_backing || '',
        wallpaper_installation: editItem.productDetails?.wallpaper_installation || '',
        
        //Upholstery
        upholstery_color: editItem.productDetails?.upholstery_color || '',
        upholstery_unit: editItem.productDetails?.upholstery_unit || '',
        upholstery_width: editItem.productDetails?.upholstery_width || '',
        upholstery_horizontal: editItem.productDetails?.upholstery_horizontal || '',
        upholstery_vertical: editItem.productDetails?.upholstery_vertical || '',
        upholstery_content: editItem.productDetails?.upholstery_content || '',
        upholstery_backing: editItem.productDetails?.upholstery_backing || '',
        upholstery_qty: editItem.productDetails?.upholstery_qty || '',

        //Window Treatment
        wt_unit: editItem.productDetails?.wt_unit || '',
        wt_len_window: editItem.productDetails?.wt_len_window || '',
        wt_wid_window: editItem.productDetails?.wt_wid_window || '',
        wt_height_window: editItem.productDetails?.wt_height_window || '',
        wt_mount: editItem.productDetails?.wt_mount || '',
        wt_valance: editItem.productDetails?.wt_valance || '',
        wt_vendor_provided_fabric: editItem.productDetails?.wt_vendor_provided_fabric || '',
        wt_fabric: editItem.productDetails?.wt_fabric || '',
        wt_com_fabric: editItem.productDetails?.wt_com_fabric || '',
        wt_pattern_name: editItem.productDetails?.wt_pattern_name || '',
        wt_sku: editItem.productDetails?.wt_sku || '',
        wt_color: editItem.productDetails?.wt_color || '',
        wt_horizontal: editItem.productDetails?.wt_horizontal || '',
        wt_vertical: editItem.productDetails?.wt_vertical || '',
        wt_content: editItem.productDetails?.wt_content || '',
        wt_backing: editItem.productDetails?.wt_backing || '',
        wt_installation_type: editItem.productDetails?.wt_installation_type || '',
        wt_type: editItem.productDetails?.wt_type || '',
        wt_drapery_style: editItem.productDetails?.wt_drapery_style || '',
        wt_drapery_fullness: editItem.productDetails?.wt_drapery_fullness || '',
        wt_drapery_hem: editItem.productDetails?.wt_drapery_hem || '',
        wt_drapery_construction: editItem.productDetails?.wt_drapery_construction || '',
        wt_drapery_control: editItem.productDetails?.wt_drapery_control || '',
        wt_drapery_control_location: editItem.productDetails?.wt_drapery_control_location || '',
        wt_drapery_hardware: editItem.productDetails?.wt_drapery_hardware || '',
        wt_drapery_blackout_linear: editItem.productDetails?.wt_drapery_blackout_linear || '',
        wt_shade_style: editItem.productDetails?.wt_shade_style || '',
        wt_shade_fullness: editItem.productDetails?.wt_shade_fullness || '',
        wt_shade_hem: editItem.productDetails?.wt_shade_hem || '',
        wt_shade_construction: editItem.productDetails?.wt_shade_construction || '',
        wt_shade_control_type: editItem.productDetails?.wt_shade_control_type || '',
        wt_shade_control_location: editItem.productDetails?.wt_shade_control_location || '',
        wt_shade_hardware: editItem.productDetails?.wt_shade_hardware || '',
        wt_shade_blackout_linear: editItem.productDetails?.wt_shade_blackout_linear || '',         


    } : {
        projectId: id,
        type: 'Product',
        furnishing: '',
        name: '',
        code: '',
        qty: null,
        sku:'',
        imageUrl: '',
        vendor: '',
        rfq: '',
        net_cost: '',
        shipping_cost: '',
        other_cost: '',
        po_amount: '',
        buy_tax: '',
        buy_sales_tax: '',
        sell_markup: '',
        client_product_cost: '',
        client_price: '',
        sell_tax: '',
        sell_sales_tax: '',


        //Accessory
        acessory_unit: '',
        acessory_len: null,
        acessory_wid: null,
        acessory_height: null,
        acessory_color: '',
        acessory_finish: '',        

        //Area Rug
        arearug_unit: '',
        arearug_len: null,
        arearug_wid: null,
        arearug_rugpad: '',
        arearug_content: '',
        arearug_custom:'',
        arearug_color: '',
        arearug_gauge: '',
        arearug_pile: null,
        arearug_stitches: '',
        arearug_pattern: '',
        arearug_construction: '',
        arearug_backing: '',
        arearug_secondaryBacking: '',

        //Equipment
        equipment_unit: '',
        equipment_len: null,
        equipment_wid: null,
        equipment_height: null,
        equipment_color: '',
        equipment_finish: '',


        //Hardware
        hardware_unit: '',
        hardware_len: null,
        hardware_wid: null,
        hardware_height: null,
        hardware_color: '',
        hardware_finish: '',
        

        //Artwork
        artwork_unit: '',
        artwork_len_overall: null,
        artwork_wid_overall: null,
        artwork_height_overall: null,
        artwork_wid_frame: null,
        artwork_height_frame: null,
        artwork_len_artwork: null,
        artwork_wid_artwork: null,
        artwork_medium: '',
        artwork_frame_item: '',
        artwork_frame_material: '',
        artwork_frame_finish: '',
        artwork_mat_color: '',
        artwork_mat_size: '',
        artwork_orientation: '',
        artwork_glass: '',
        artwork_mounting_hardware: '', 
        
        //Casegood
        casegood_unit: '',
        casegood_len: null,
        casegood_wid: null,
        casegood_height: null,
        casegood_top: '',
        casegood_finish: '',
        casegood_outlet: '',
        casegood_hardware: '',
        casegood_installation_type: '',

        //fabric
        fabric_color: '',
        fabric_unit: null,
        fabric_width: null,
        fabric_horizontal: null,
        fabric_vertical: null,
        fabric_content: '',
        fabric_backing: '',
        fabric_cfa_required: '',
        fabric_cfa_waived: '',
               

        //Handwired
        hardwired_unit: null,
        hardwired_len_overall: null,
        hardwired_wid_overall: null,
        hardwired_height_overall: null,
        hardwired_len_fixture: null,
        hardwired_wid_fixture: null,
        hardwired_height_fixture: null,
        hardwired_len_shade: null,
        hardwired_wid_shade: null,
        hardwired_height_shade: null,
        hardwired_color: '',
        hardwired_finish: '',
        hardwired_base_material: '',
        hardwired_shade_material: '',
        hardwired_shade_type: '',
        hardwired_switch_type: '',
        hardwired_quantity: null,
        hardwired_socket_type: '',
        hardwired_dimmable: '',
        hardwired_switch: '',
        hardwired_wattaga: '',
        hardwired_temperature: '',
        hardwired_rating: '',
        hardwired: '',

        //Decorative Lighting
        decorative_lighting_unit: null,
        decorative_lighting_len_overall: null,
        decorative_lighting_wid_overall: null,
        decorative_lighting_height_overall: null,
        decorative_lighting_len_fixture: null,
        decorative_lighting_wid_fixture: null,
        decorative_lighting_height_fixture: null,
        decorative_lighting_len_shade: null,
        decorative_lighting_wid_shade: null,
        decorative_lighting_height_shade: null,
        decorative_lighting_color: '',
        decorative_lighting_finish: '',
        decorative_lighting_base_material: '',
        decorative_lighting_shade_material: '',
        decorative_lighting_shade_type: '',
        decorative_lighting_switch_type: '',
        decorative_lighting_quantity: null,
        decorative_lighting_socket_type: '',
        decorative_lighting_dimmable: '',
        decorative_lighting_switch: '',
        decorative_lighting_wattaga: '',
        decorative_lighting_temperature: '',
        decorative_lighting_rating: '',

        //Mirror
        mirror_unit: null,
        mirror_len: null,
        mirror_wid: null,
        mirror_height: null,
        mirror_color: '',
        mirror_finish: '',
        mirror_orientation: '',
        mirror_glass: '',
        mirror_mounting_hardware: '',
        
        //Miscellaneous
        miscellaneous_fabrication_style: '',
        miscellaneous_pattern: '',
        miscellaneous_insert: '',

        //Table
        table_unit: null,
        table_len: null,
        table_wid: null,
        table_height: null,
        table_other_dimension: '',
        table_top: '',
        table_finish: '',
        table_hardware: '',

        //Seating
        seating_unit: '',
        seating_len: null,
        seating_wid: null,
        seating_height: null,
        seating_finish: '',
        seating_vendor_provided_fabric: '',
        seating_fabric: '',
        seating_com_fabric: '',
        seating_pattern_name: '',
        seating_sku: '',
        seating_color: '',
        seating_width: null,
        seating_horizontal: null,
        seating_vertical: null,
        seating_content: '',
        seating_backing: '',
        seating_qty: '',

        //wallpaper
        wallpaper_color: '',
        wallpaper_unit: '',
        wallpaper_width: null,
        wallpaper_horizontal: null,
        wallpaper_vertical: null,
        wallpaper_content: '',
        wallpaper_type: '',
        wallpaper_weight: '',
        wallpaper_backing: '',
        wallpaper_installation: '',

        //Upholstery
        upholstery_color: '',
        upholstery_unit: '',
        upholstery_width: null,
        upholstery_horizontal: null,
        upholstery_vertical: null,
        upholstery_content: '',
        upholstery_backing: '',
        upholstery_qty: null,

        //Window Treatment
        wt_unit: '',
        wt_len_window: null,
        wt_wid_window: null,
        wt_height_window: null,
        wt_mount: '',
        wt_valance: '',
        wt_vendor_provided_fabric: '',
        wt_fabric: '',
        wt_com_fabric: '',
        wt_pattern_name: '',
        wt_sku: '',
        wt_color: '',
        wt_horizontal: null,
        wt_vertical: null,
        wt_content: '',
        wt_backing: '',
        wt_installation_type: '',
        wt_type: '',
        wt_drapery_style: '',
        wt_drapery_fullness: '',
        wt_drapery_hem: '',
        wt_drapery_construction: '',
        wt_drapery_control: '',
        wt_drapery_control_location: '',
        wt_drapery_hardware: '',
        wt_drapery_blackout_linear: '',
        wt_shade_style: '',
        wt_shade_fullness: '',
        wt_shade_hem: '',
        wt_shade_construction: '',
        wt_shade_control_type: '',
        wt_shade_control_location: '',
        wt_shade_hardware: '',
        wt_shade_blackout_linear: '',             

    };
    const [FurnishingType, setFurnishingType] = useState([]);
    const [rfqs, setRfqs] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState(isEditMode && editItem ? editItem.imageUrl.split('/').pop() : '');
    const [vendors, setVendors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode && editItem) {
            setFormData({
                projectId: id,
                type: 'Product',
                furnishing: editItem.furnishing || '',
                name: editItem.title || '',
                code: editItem.productDetails?.code || '',
                qty: editItem.qty || '',
                sku: editItem.sku || '',
                imageUrl: editItem.imageUrl || '',
                vendor : editItem.vendor || '',
                rfq : editItem.rfq || '',
                net_cost : editItem.net_cost || '',
                shipping_cost : editItem.shipping_cost || '',
                other_cost : editItem.other_cost || '',
                po_amount : editItem.po_amount || '',
                buy_tax : editItem.buy_tax || '',
                buy_sales_tax : editItem.buy_sales_tax || '',
                sell_markup : editItem.sell_markup || '',
                client_product_cost : editItem.client_product_cost || '',
                client_price : editItem.client_price || '',
                sell_tax : editItem.sell_tax || '',
                sell_sales_tax : editItem.sell_sales_tax || '',                


                //Accessory
                acessory_unit: editItem.productDetails?.acessory_unit || '',
                acessory_len: editItem.productDetails?.acessory_len || '',
                acessory_wid: editItem.productDetails?.acessory_wid || '',
                acessory_height: editItem.productDetails?.acessory_height || '',
                acessory_color: editItem.productDetails?.acessory_color || '',
                acessory_finish: editItem.productDetails?.acessory_finish || '',

                //Area Rug
                arearug_unit: editItem.productDetails?.arearug_unit || '',
                arearug_len: editItem.productDetails?.arearug_len || '',
                arearug_wid: editItem.productDetails?.arearug_wid || '',
                arearug_rugpad: editItem.productDetails?.arearug_rugpad || '',
                arearug_content: editItem.productDetails?.arearug_content || '',
                arearug_custom: editItem.productDetails?.arearug_custom || '',
                arearug_color: editItem.productDetails?.arearug_color || '',
                arearug_gauge: editItem.productDetails?.arearug_gauge || '',
                arearug_pile: editItem.productDetails?.arearug_pile || '',
                arearug_stitches: editItem.productDetails?.arearug_stitches || '',
                arearug_construction: editItem.productDetails?.arearug_construction || '',
                arearug_backing: editItem.productDetails?.arearug_backing || '',
                arearug_secondaryBacking: editItem.productDetails?.arearug_secondaryBacking || '',


                //Equipment
                equipment_unit: editItem.productDetails?.equipment_unit || '',
                equipment_len: editItem.productDetails?.equipment_len || '',
                equipment_wid: editItem.productDetails?.equipment_wid || '',
                equipment_height: editItem.productDetails?.equipment_height || '',
                equipment_color: editItem.productDetails?.equipment_color || '',
                equipment_finish: editItem.productDetails?.equipment_finish || '',


                //Hardware
                hardware_unit: editItem.productDetails?.hardware_unit || '',
                hardware_len: editItem.productDetails?.hardware_len || '',
                hardware_wid: editItem.productDetails?.hardware_wid || '',
                hardware_height: editItem.productDetails?.hardware_height || '',
                hardware_color: editItem.productDetails?.hardware_color || '',
                hardware_finish: editItem.productDetails?.hardware_finish || '',


                //Artwork
                artwork_unit: editItem.productDetails?.artwork_unit || '',
                artwork_len_overall: editItem.productDetails?.artwork_len_overall || '',
                artwork_wid_overall: editItem.productDetails?.artwork_wid_overall || '',
                artwork_height_overall: editItem.productDetails?.artwork_height_overall || '',
                artwork_wid_frame: editItem.productDetails?.artwork_wid_frame || '',
                artwork_height_frame: editItem.productDetails?.artwork_height_frame || '',
                artwork_len_artwork: editItem.productDetails?.artwork_len_artwork || '',
                artwork_wid_artwork: editItem.productDetails?.artwork_wid_artwork || '',
                artwork_medium: editItem.productDetails?.artwork_medium || '',
                artwork_frame_item: editItem.productDetails?.artwork_frame_item || '',
                artwork_frame_material: editItem.productDetails?.artwork_frame_material || '',
                artwork_frame_finish: editItem.productDetails?.artwork_frame_finish || '',
                artwork_mat_color: editItem.productDetails?.artwork_mat_color || '',
                artwork_mat_size: editItem.productDetails?.artwork_mat_size || '',
                artwork_orientation: editItem.productDetails?.artwork_orientation || '',
                artwork_glass: editItem.productDetails?.artwork_glass || '',
                artwork_mounting_hardware: editItem.productDetails?.artwork_mounting_hardware || '',

                //Casegood
                casegood_unit: editItem.productDetails?.casegood_unit || '',
                casegood_len: editItem.productDetails?.casegood_len || '',
                casegood_wid: editItem.productDetails?.casegood_wid || '',
                casegood_height: editItem.productDetails?.casegood_height || '',
                casegood_top: editItem.productDetails?.casegood_top || '',
                casegood_finish: editItem.productDetails?.casegood_finish || '',
                casegood_outlet: editItem.productDetails?.casegood_outlet || '',
                casegood_hardware: editItem.productDetails?.casegood_hardware || '',
                casegood_installation_type: editItem.productDetails?.casegood_installation_type || '',


                //fabric
                fabric_color: editItem.productDetails?.fabric_color || '',
                fabric_unit: editItem.productDetails?.fabric_unit || '',
                fabric_width: editItem.productDetails?.fabric_width || '',
                fabric_horizontal: editItem.productDetails?.fabric_horizontal || '',
                fabric_vertical: editItem.productDetails?.fabric_vertical || '',
                fabric_content: editItem.productDetails?.fabric_content || '',
                fabric_backing: editItem.productDetails?.fabric_backing || '',
                fabric_cfa_required: editItem.productDetails?.fabric_cfa_required || '',
                fabric_cfa_waived: editItem.productDetails?.fabric_cfa_waived || '',


                //Handwired
                hardwired_unit: editItem.productDetails?.hardwired_unit || '',
                hardwired_len_overall: editItem.productDetails?.hardwired_len_overall || '',
                hardwired_wid_overall: editItem.productDetails?.hardwired_wid_overall || '',
                hardwired_height_overall: editItem.productDetails?.hardwired_height_overall || '',
                hardwired_len_fixture: editItem.productDetails?.hardwired_len_fixture || '',
                hardwired_wid_fixture: editItem.productDetails?.hardwired_wid_fixture || '',
                hardwired_height_fixture: editItem.productDetails?.hardwired_height_fixture || '',
                hardwired_len_shade: editItem.productDetails?.hardwired_len_shade || '',
                hardwired_wid_shade: editItem.productDetails?.hardwired_wid_shade || '',
                hardwired_height_shade: editItem.productDetails?.hardwired_height_shade || '',
                hardwired_color: editItem.productDetails?.hardwired_color || '',
                hardwired_finish: editItem.productDetails?.hardwired_finish || '',
                hardwired_base_material: editItem.productDetails?.hardwired_base_material || '',
                hardwired_shade_material: editItem.productDetails?.hardwired_shade_material || '',
                hardwired_shade_type: editItem.productDetails?.hardwired_shade_type || '',
                hardwired_switch_type: editItem.productDetails?.hardwired_switch_type || '',
                hardwired_quantity: editItem.productDetails?.hardwired_quantity || '',
                hardwired_socket_type: editItem.productDetails?.hardwired_socket_type || '',
                hardwired_dimmable: editItem.productDetails?.hardwired_dimmable || '',
                hardwired_switch: editItem.productDetails?.hardwired_switch || '',
                hardwired_wattaga: editItem.productDetails?.hardwired_wattaga || '',
                hardwired_temperature: editItem.productDetails?.hardwired_temperature || '',
                hardwired_rating: editItem.productDetails?.hardwired_rating || '',
                hardwired: editItem.productDetails?.hardwired || '',

                //Decorative Lighting
                decorative_lighting_unit: editItem.productDetails?.decorative_lighting_unit || '',
                decorative_lighting_len_overall: editItem.productDetails?.decorative_lighting_len_overall || '',
                decorative_lighting_wid_overall: editItem.productDetails?.decorative_lighting_wid_overall || '',
                decorative_lighting_height_overall: editItem.productDetails?.decorative_lighting_height_overall || '',
                decorative_lighting_len_fixture: editItem.productDetails?.decorative_lighting_len_fixture || '',
                decorative_lighting_wid_fixture: editItem.productDetails?.decorative_lighting_wid_fixture || '',
                decorative_lighting_height_fixture: editItem.productDetails?.decorative_lighting_height_fixture || '',
                decorative_lighting_len_shade: editItem.productDetails?.decorative_lighting_len_shade || '',
                decorative_lighting_wid_shade: editItem.productDetails?.decorative_lighting_wid_shade || '',
                decorative_lighting_height_shade: editItem.productDetails?.decorative_lighting_height_shade || '',
                decorative_lighting_color: editItem.productDetails?.decorative_lighting_color || '',
                decorative_lighting_finish: editItem.productDetails?.decorative_lighting_finish || '',
                decorative_lighting_base_material: editItem.productDetails?.decorative_lighting_base_material || '',
                decorative_lighting_shade_material: editItem.productDetails?.decorative_lighting_shade_material || '',
                decorative_lighting_shade_type: editItem.productDetails?.decorative_lighting_shade_type || '',
                decorative_lighting_switch_type: editItem.productDetails?.decorative_lighting_switch_type || '',
                decorative_lighting_quantity: editItem.productDetails?.decorative_lighting_quantity || '',
                decorative_lighting_socket_type: editItem.productDetails?.decorative_lighting_socket_type || '',
                decorative_lighting_dimmable: editItem.productDetails?.decorative_lighting_dimmable || '',
                decorative_lighting_switch: editItem.productDetails?.decorative_lighting_switch || '',
                decorative_lighting_wattaga: editItem.productDetails?.decorative_lighting_wattaga || '',
                decorative_lighting_temperature: editItem.productDetails?.decorative_lighting_temperature || '',
                decorative_lighting_rating: editItem.productDetails?.decorative_lighting_rating || '',
                
                //Mirror
                mirror_unit: editItem.productDetails?.mirror_unit || '',
                mirror_len: editItem.productDetails?.mirror_len || '',
                mirror_wid: editItem.productDetails?.mirror_wid || '',
                mirror_height: editItem.productDetails?.mirror_height || '',
                mirror_color: editItem.productDetails?.mirror_color || '',
                mirror_finish: editItem.productDetails?.mirror_finish || '',
                mirror_orientation: editItem.productDetails?.mirror_orientation || '',
                mirror_glass: editItem.productDetails?.mirror_glass || '',
                mirror_mounting_hardware: editItem.productDetails?.mirror_mounting_hardware || '',

                //Miscellaneous
                miscellaneous_fabrication_style: editItem.productDetails?.miscellaneous_fabrication_style || '',
                miscellaneous_pattern: editItem.productDetails?.miscellaneous_pattern || '',
                miscellaneous_insert: editItem.productDetails?.miscellaneous_insert || '',

                //Table
                table_unit: editItem.productDetails?.table_unit || '',
                table_len: editItem.productDetails?.table_len || '',
                table_wid: editItem.productDetails?.table_wid || '',
                table_height: editItem.productDetails?.table_height || '',
                table_other_dimension: editItem.productDetails?.table_other_dimension || '',
                table_top: editItem.productDetails?.table_top || '',
                table_finish: editItem.productDetails?.table_finish || '',
                table_hardware: editItem.productDetails?.table_hardware || '',

                //Seating
                seating_unit: editItem.productDetails?.seating_unit || '',
                seating_len: editItem.productDetails?.seating_len || '',
                seating_wid: editItem.productDetails?.seating_wid || '',
                seating_height: editItem.productDetails?.seating_height || '',
                seating_finish: editItem.productDetails?.seating_finish || '',
                seating_vendor_provided_fabric: editItem.productDetails?.seating_vendor_provided_fabric || '',
                seating_fabric: editItem.productDetails?.seating_fabric || '',
                seating_com_fabric: editItem.productDetails?.seating_com_fabric || '',
                seating_pattern_name: editItem.productDetails?.seating_pattern_name || '',
                seating_sku: editItem.productDetails?.seating_sku || '',
                seating_color: editItem.productDetails?.seating_color || '',
                seating_width: editItem.productDetails?.seating_width || '',
                seating_horizontal: editItem.productDetails?.seating_horizontal || '',
                seating_vertical: editItem.productDetails?.seating_vertical || '',
                seating_content: editItem.productDetails?.seating_content || '',
                seating_backing: editItem.productDetails?.seating_backing || '',
                seating_qty: editItem.productDetails?.seating_qty || '',

                //wallpaper
                wallpaper_color: editItem.productDetails?.wallpaper_color || '',
                wallpaper_unit: editItem.productDetails?.wallpaper_unit || '',
                wallpaper_width: editItem.productDetails?.wallpaper_width || '',
                wallpaper_horizontal: editItem.productDetails?.wallpaper_horizontal || '',
                wallpaper_vertical: editItem.productDetails?.wallpaper_vertical || '',
                wallpaper_content: editItem.productDetails?.wallpaper_content || '',
                wallpaper_type: editItem.productDetails?.wallpaper_type || '',
                wallpaper_weight: editItem.productDetails?.wallpaper_weight || '',
                wallpaper_backing: editItem.productDetails?.wallpaper_backing || '',
                wallpaper_installation: editItem.productDetails?.wallpaper_installation || '',
                
                //Upholstery
                upholstery_color: editItem.productDetails?.upholstery_color || '',
                upholstery_unit: editItem.productDetails?.upholstery_unit || '',
                upholstery_width: editItem.productDetails?.upholstery_width || '',
                upholstery_horizontal: editItem.productDetails?.upholstery_horizontal || '',
                upholstery_vertical: editItem.productDetails?.upholstery_vertical || '',
                upholstery_content: editItem.productDetails?.upholstery_content || '',
                upholstery_backing: editItem.productDetails?.upholstery_backing || '',
                upholstery_qty: editItem.productDetails?.upholstery_qty || '',

                //Window Treatment
                wt_unit: editItem.productDetails?.wt_unit || '',
                wt_len_window: editItem.productDetails?.wt_len_window || '',
                wt_wid_window: editItem.productDetails?.wt_wid_window || '',
                wt_height_window: editItem.productDetails?.wt_height_window || '',
                wt_mount: editItem.productDetails?.wt_mount || '',
                wt_valance: editItem.productDetails?.wt_valance || '',
                wt_vendor_provided_fabric: editItem.productDetails?.wt_vendor_provided_fabric || '',
                wt_fabric: editItem.productDetails?.wt_fabric || '',
                wt_com_fabric: editItem.productDetails?.wt_com_fabric || '',
                wt_pattern_name: editItem.productDetails?.wt_pattern_name || '',
                wt_sku: editItem.productDetails?.wt_sku || '',
                wt_color: editItem.productDetails?.wt_color || '',
                wt_horizontal: editItem.productDetails?.wt_horizontal || '',
                wt_vertical: editItem.productDetails?.wt_vertical || '',
                wt_content: editItem.productDetails?.wt_content || '',
                wt_backing: editItem.productDetails?.wt_backing || '',
                wt_installation_type: editItem.productDetails?.wt_installation_type || '',
                wt_type: editItem.productDetails?.wt_type || '',
                wt_drapery_style: editItem.productDetails?.wt_drapery_style || '',
                wt_drapery_fullness: editItem.productDetails?.wt_drapery_fullness || '',
                wt_drapery_hem: editItem.productDetails?.wt_drapery_hem || '',
                wt_drapery_construction: editItem.productDetails?.wt_drapery_construction || '',
                wt_drapery_control: editItem.productDetails?.wt_drapery_control || '',
                wt_drapery_control_location: editItem.productDetails?.wt_drapery_control_location || '',
                wt_drapery_hardware: editItem.productDetails?.wt_drapery_hardware || '',
                wt_drapery_blackout_linear: editItem.productDetails?.wt_drapery_blackout_linear || '',
                wt_shade_style: editItem.productDetails?.wt_shade_style || '',
                wt_shade_fullness: editItem.productDetails?.wt_shade_fullness || '',
                wt_shade_hem: editItem.productDetails?.wt_shade_hem || '',
                wt_shade_construction: editItem.productDetails?.wt_shade_construction || '',
                wt_shade_control_type: editItem.productDetails?.wt_shade_control_type || '',
                wt_shade_control_location: editItem.productDetails?.wt_shade_control_location || '',
                wt_shade_hardware: editItem.productDetails?.wt_shade_hardware || '',
                wt_shade_blackout_linear: editItem.productDetails?.wt_shade_blackout_linear || '',
                               

            });
            setFileName(editItem.imageUrl.split('/').pop());
        }
    }, [editItem, isEditMode, id]);

    const handleInputChange = (e) => {
        const { name, value, maxLength } = e.target;
        const effectiveMaxLength = maxLength || 50;
        console.log(name)
        console.log(value)
        //console.log(effectiveMaxLength);
        //console.log(value.slice(0, effectiveMaxLength))
        
        setFormData((prevData) => ({ ...prevData, [name]: value.slice(0, effectiveMaxLength) }));

        if(name == 'furnishing'){
            //Generate product COde
            if(!isEditMode){
                const areaCode =  ConfigurationType.find(sec => sec.name === secName).code;
                const furnishingCode = FurnishingType.find(option => option.name === value).code;
                const clientCode = client.split('-')[0];
                const len = products.length+1;
                formData.code = clientCode + "-" + areaCode + "-" + furnishingCode + "-" + len;
            }

            //Accessory
            formData.acessory_unit= '';
            formData.acessory_len= null;
            formData.acessory_wid= null;
            formData.acessory_height= null;
            formData.acessory_color= '';
            formData.acessory_finish= '';

            //Area Rug
            formData.arearug_unit= '';
            formData.arearug_len= null;
            formData.arearug_wid= null;
            formData.arearug_rugpad= '';
            formData.arearug_content= '';
            formData.arearug_color= '';
            formData.arearug_gauge= '';
            formData.arearug_pile= null;
            formData.arearug_stitches= '';
            formData.arearug_pattern= '';
            formData.arearug_construction= '';
            formData.arearug_backing= '';
            formData.arearug_secondaryBacking= '';

            //Equipment
            formData.equipment_unit= '';
            formData.equipment_len= null;
            formData.equipment_wid= null;
            formData.equipment_height= null;
            formData.equipment_color= '';
            formData.equipment_finish= '';

            //Hardware
            formData.hardware_unit= '';
            formData.hardware_len= null;
            formData.hardware_wid= null;
            formData.hardware_height= null;
            formData.hardware_color= '';
            formData.hardware_finish= '';

            
            //Artwork
            formData.artwork_unit= '',
            formData.artwork_len_overall= null;
            formData.artwork_wid_overall= null;
            formData.artwork_height_overall= null;
            formData.artwork_wid_frame= null;
            formData.artwork_height_frame= null;
            formData.artwork_len_artwork= null;
            formData.artwork_wid_artwork= null;
            formData.artwork_medium= '';
            formData.artwork_frame_item= '';
            formData.artwork_frame_material= '';
            formData.artwork_frame_finish= '';
            formData.artwork_mat_color= '';
            formData.artwork_mat_size= '';
            formData.artwork_orientation= '';
            formData.artwork_glass= '';
            formData.artwork_mounting_hardware= '';


            //Casegood
            formData.casegood_unit= '';
            formData.casegood_len= null;
            formData.casegood_wid= null;
            formData.casegood_height= null;
            formData.casegood_top= '';
            formData.casegood_finish= '';
            formData.casegood_outlet= '';
            formData.casegood_hardware= '';
            formData.casegood_installation_type= '';
            
            //fabric
            formData.fabric_color= '';
            formData.fabric_unit= '';
            formData.fabric_width= null;
            formData.fabric_horizontal= null;
            formData.fabric_vertical= null;
            formData.fabric_content= '';
            formData.fabric_backing= '';
            formData.fabric_cfa_required= '';
            formData.fabric_cfa_waived= '';

            //Handwired
            formData.hardwired_unit= '';
            formData.hardwired_len_overall= null;
            formData.hardwired_wid_overall= null;
            formData.hardwired_height_overall= null;
            formData.hardwired_len_fixture= null;
            formData.hardwired_wid_fixture= null;
            formData.hardwired_height_fixture= null;
            formData.hardwired_len_shade= null;
            formData.hardwired_wid_shade= null;
            formData.hardwired_height_shade= null;
            formData.hardwired_color= '';
            formData.hardwired_finish= '';
            formData.hardwired_base_material= '';
            formData.hardwired_shade_material= '';
            formData.hardwired_shade_type= '';
            formData.hardwired_switch_type= '';
            formData.hardwired_quantity= null;
            formData.hardwired_socket_type= '';
            formData.hardwired_dimmable= '';
            formData.hardwired_switch= '';
            formData.hardwired_wattaga= '';
            formData.hardwired_temperature= '';
            formData.hardwired_rating= '';
            formData.hardwired= '';

            //Decorative Lighting
            formData.decorative_lighting_unit= '';
            formData.decorative_lighting_len_overall= null;
            formData.decorative_lighting_wid_overall= null;
            formData.decorative_lighting_height_overall= null;
            formData.decorative_lighting_len_fixture= null;
            formData.decorative_lighting_wid_fixture= null;
            formData.decorative_lighting_height_fixture= null;
            formData.decorative_lighting_len_shade= null;
            formData.decorative_lighting_wid_shade= null;
            formData.decorative_lighting_height_shade= null;
            formData.decorative_lighting_color= '';
            formData.decorative_lighting_finish= '';
            formData.decorative_lighting_base_material= '';
            formData.decorative_lighting_shade_material= '';
            formData.decorative_lighting_shade_type= '';
            formData.decorative_lighting_switch_type= '';
            formData.decorative_lighting_quantity= null;
            formData.decorative_lighting_socket_type= '';
            formData.decorative_lighting_dimmable= '';
            formData.decorative_lighting_switch= '';
            formData.decorative_lighting_wattaga= '';
            formData.decorative_lighting_temperature= '';
            formData.decorative_lighting_rating= '';

            //Mirror
            formData.mirror_unit= '';
            formData.mirror_len= null;
            formData.mirror_wid= null;
            formData.mirror_height= null;
            formData.mirror_color= '';
            formData.mirror_finish= '';
            formData.mirror_orientation= '';
            formData.mirror_glass= '';
            formData.mirror_mounting_hardware= '';
            
            //Miscellaneous
            formData.miscellaneous_fabrication_style= '';
            formData.miscellaneous_pattern= '';
            formData.miscellaneous_insert= '';

            //Table
            formData.table_unit= '';
            formData.table_len= null;
            formData.table_wid= null;
            formData.table_height= null;
            formData.table_other_dimension= '';
            formData.table_top= '';
            formData.table_finish= '';
            formData.table_hardware= '';

            //Seating
            formData.seating_unit= '';
            formData.seating_len= null;
            formData.seating_wid= null;
            formData.seating_height= null;
            formData.seating_color= '';
            formData.seating_finish= '';
            formData.seating_vendor_provided_fabric= '';
            formData.seating_fabric= '';
            formData.seating_com_fabric= '';
            formData.seating_pattern_name= '';
            formData.seating_sku= '';
            formData.seating_color= '';
            formData.seating_width= null;
            formData.seating_horizontal= null;
            formData.seating_vertical= null;
            formData.seating_content= '';
            formData.seating_backing= '';
            formData.seating_qty= '';

            //wallpaper
            formData.wallpaper_color= '';
            formData.wallpaper_unit= '';
            formData.wallpaper_width= null;
            formData.wallpaper_horizontal= null;
            formData.wallpaper_vertical= null;
            formData.wallpaper_content= '';
            formData.wallpaper_type= '';
            formData.wallpaper_weight= '';
            formData.wallpaper_backing= '';
            formData.wallpaper_installation= '';
            
            //Upholstery
            formData.upholstery_color= '';
            formData.upholstery_unit= '';
            formData.upholstery_width= null;
            formData.upholstery_horizontal= null;
            formData.upholstery_vertical= null;
            formData.upholstery_content= '';
            formData.upholstery_backing= '';
            formData.upholstery_qty= null;

            //Window Treatment
            formData.wt_unit= '';
            formData.wt_len_window= null;
            formData.wt_wid_window= null;
            formData.wt_height_window= null;
            formData.wt_mount= '';
            formData.wt_valance= '';
            formData.wt_vendor_provided_fabric= '';
            formData.wt_fabric= '';
            formData.wt_com_fabric= '';
            formData.wt_pattern_name= '';
            formData.wt_sku= '';
            formData.wt_color= '';
            formData.wt_horizontal= null;
            formData.wt_vertical= null;
            formData.wt_content= '';
            formData.wt_backing= '';
            formData.wt_installation_type= '';
            formData.wt_type= '';
            formData.wt_drapery_style= '';
            formData.wt_drapery_fullness= '';
            formData.wt_drapery_hem= '';
            formData.wt_drapery_construction= '';
            formData.wt_drapery_control= '';
            formData.wt_drapery_control_location= '';
            formData.wt_drapery_hardware= '';
            formData.wt_drapery_blackout_linear= '';
            formData.wt_shade_style= '';
            formData.wt_shade_fullness= '';
            formData.wt_shade_hem= '';
            formData.wt_shade_construction= '';
            formData.wt_shade_control_type= '';
            formData.wt_shade_control_location= '';
            formData.wt_shade_hardware= '';
            formData.wt_shade_blackout_linear= '';

        }

        if(name == 'arearug_custom'){
            formData.arearug_color= '';
            formData.arearug_gauge= '';
            formData.arearug_pile= null;
            formData.arearug_stitches= '';
            formData.arearug_pattern= '';
            formData.arearug_construction= '';
            formData.arearug_backing= '';
            formData.arearug_secondaryBacking= '';
        }

        if(name == 'wt_vendor_provided_fabric'){
            formData.wt_fabric = '';
        }

        if(name == 'wt_com_fabric'){
            formData.wt_pattern_name = '';
            formData.wt_sku = '';
            formData.wt_color = '';
            formData.wt_horizontal = '';
            formData.wt_vertical = '';
            formData.wt_content = '';
            formData.wt_backing = '';
            formData.wt_installation_type = '';
        }

        if(name == 'wt_type'){
            formData.wt_drapery_style = '';
            formData.wt_drapery_fullness = '';
            formData.wt_drapery_hem = '';
            formData.wt_drapery_construction = '';
            formData.wt_drapery_control = '';
            formData.wt_drapery_control_location = '';
            formData.wt_drapery_hardware = '';
            formData.wt_drapery_blackout_linear = '';
            formData.wt_shade_style = '';
            formData.wt_shade_fullness = '';
            formData.wt_shade_hem = '';
            formData.wt_shade_construction = '';
            formData.wt_shade_control_type = '';
            formData.wt_shade_control_location = '';
            formData.wt_shade_hardware = '';
            formData.wt_shade_blackout_linear = '';
        }

        if (isEditMode) {
            if(name == 'rfq'){
                const rfq = rfqs.find(rfq => rfq.rfqId === value);
                if (rfq) {
                    const product = rfq.products.find(product => product.productId === editItem._id);
                    if (product) {
                        formData.net_cost = product.price;
                        formData.vendor = rfq.vendor;
                    }
                }

            }
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    const handleUpload = async () => {
        if (!selectedFile) return formData.imageUrl;

        const uploadData = new FormData();
        uploadData.append('image', selectedFile);

        try {
            const response = await axios.post(`${backendServer}/api/upload`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name.length === 0 || formData.code.length === 0 || (!isEditMode && !selectedFile)) {
            toast.error("Fill the mandatory fields");
            handleClose();
        } else {
            try {
                const uploadedImageUrl = await handleUpload();

                if (uploadedImageUrl !== null) {
                    const finalFormData = { ...formData, imageUrl: uploadedImageUrl };

                    if (isEditMode) {
                        const response = await axios.put(`${backendServer}/api/newProductItem/${editItem._id}`, finalFormData);
                        toast.success(response.data.message);
                    } else {
                        const response = await axios.post(`${backendServer}/api/newProductItem`, finalFormData);
                        toast.success(response.data.message);
                    }
                    handleClose();
                    fetchDetails();
                    resetForm();
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            projectId: id,
            type: 'Product',
            furnishing: '',
            name: '',
            code: '',
            qty: null,
            sku: '',
            vendor: '',
            rfq: '',
            net_cost: '',
            shipping_cost: '',
            other_cost: '',
            po_amount: '',
            buy_tax: '',
            buy_sales_tax: '',
            sell_markup: '',
            client_product_cost: '',
            client_price: '',
            sell_tax: '',
            sell_sales_tax: '',
            // vendor: '',
            // budget: null,
            // buyCost: null,
            // sellCost: null,
            // desc: '',
            imageUrl: '',

            //Accessory
            acessory_unit: '',
            acessory_len: null,
            acessory_wid: null,
            acessory_height: null,
            acessory_color: '',
            acessory_finish: '',

            //Area Rug
            arearug_unit: '',
            arearug_len: null,
            arearug_wid: null,
            arearug_rugpad: '',
            arearug_content: '',
            arearug_custom: '',
            arearug_color: '',
            arearug_gauge: '',
            arearug_pile: null,
            arearug_stitches: '',
            arearug_pattern: '',
            arearug_construction: '',
            arearug_backing: '',
            arearug_secondaryBacking: '',

            //Equipment
            equipment_unit: '',
            equipment_len: null,
            equipment_wid: null,
            equipment_height: null,
            equipment_color: '',
            equipment_finish: '',

            //Hardware
            hardware_unit: '',
            hardware_len: null,
            hardware_wid: null,
            hardware_height: null,
            hardware_color: '',
            hardware_finish: '',


            //Artwork
            artwork_unit: '',
            artwork_len_overall: null,
            artwork_wid_overall: null,
            artwork_height_overall: null,
            artwork_wid_frame: null,
            artwork_height_frame: null,
            artwork_len_artwork: null,
            artwork_wid_artwork: null,
            artwork_medium: '',
            artwork_frame_item: '',
            artwork_frame_material: '',
            artwork_frame_finish: '',
            artwork_mat_color: '',
            artwork_mat_size: '',
            artwork_orientation: '',
            artwork_glass: '',
            artwork_mounting_hardware: '',
            
            //Casegood
            casegood_unit: '',
            casegood_len: null,
            casegood_wid: null,
            casegood_height: null,
            casegood_top: '',
            casegood_finish: '',
            casegood_outlet: '',
            casegood_hardware: '',
            casegood_installation_type: '',

            //fabric
            fabric_color: '',
            fabric_unit: null,
            fabric_width: null,
            fabric_horizontal: null,
            fabric_vertical: null,
            fabric_content: '',
            fabric_backing: '',
            fabric_cfa_required: '',
            fabric_cfa_waived: '',
            
            //Handwired
            hardwired_unit: null,
            hardwired_len_overall: null,
            hardwired_wid_overall: null,
            hardwired_height_overall: null,
            hardwired_len_fixture: null,
            hardwired_wid_fixture: null,
            hardwired_height_fixture: null,
            hardwired_len_shade: null,
            hardwired_wid_shade: null,
            hardwired_height_shade: null,
            hardwired_color: '',
            hardwired_finish: '',
            hardwired_base_material: '',
            hardwired_shade_material: '',
            hardwired_shade_type: '',
            hardwired_switch_type: '',
            hardwired_quantity: null,
            hardwired_socket_type: '',
            hardwired_dimmable: '',
            hardwired_switch: '',
            hardwired_wattaga: '',
            hardwired_temperature: '',
            hardwired_rating: '',
            hardwired: '',

            //Decorative Lighting
            decorative_lighting_unit_: null,
            decorative_lighting_len_overall: null,
            decorative_lighting_wid_overall: null,
            decorative_lighting_height_overall: null,
            decorative_lighting_len_fixture: null,
            decorative_lighting_wid_fixture: null,
            decorative_lighting_height_fixture: null,
            decorative_lighting_len_shade: null,
            decorative_lighting_wid_shade: null,
            decorative_lighting_height_shade: null,
            decorative_lighting_color: '',
            decorative_lighting_finish: '',
            decorative_lighting_base_material: '',
            decorative_lighting_shade_material: '',
            decorative_lighting_shade_type: '',
            decorative_lighting_switch_type: '',
            decorative_lighting_quantity: null,
            decorative_lighting_socket_type: '',
            decorative_lighting_dimmable: '',
            decorative_lighting_switch: '',
            decorative_lighting_wattaga: '',
            decorative_lighting_temperature: '',
            decorative_lighting_rating: '',            

            //Mirror
            mirror_unit: null,
            mirror_len: null,
            mirror_wid: null,
            mirror_height: null,
            mirror_color: '',
            mirror_finish: '',
            mirror_orientation: '',
            mirror_glass: '',
            mirror_mounting_hardware: '',

            //Miscellaneous
            miscellaneous_fabrication_style: '',
            miscellaneous_pattern: '',
            miscellaneous_insert: '',

            //Table
            table_unit: null,
            table_len: null,
            table_wid: null,
            table_height: null,
            table_other_dimension: '',
            table_top: '',
            table_finish: '',
            table_hardware: '',

            //Seating
            seating_unit: '',
            seating_len: null,
            seating_wid: null,
            seating_height: null,
            seating_finish: '',
            seating_vendor_provided_fabric: '',
            seating_fabric: '',
            seating_com_fabric: '',
            seating_pattern_name: '',
            seating_sku: '',
            seating_color: '',
            seating_width: null,
            seating_horizontal: null,
            seating_vertical: null,
            seating_content: '',
            seating_backing: '',
            seating_qty: '',

            //wallpaper
            wallpaper_color: '',
            wallpaper_unit: '',
            wallpaper_width: null,
            wallpaper_horizontal: null,
            wallpaper_vertical: null,
            wallpaper_content: '',
            wallpaper_type: '',
            wallpaper_weight: '',
            wallpaper_backing: '',
            wallpaper_installation: '',

            //Upholstery
            upholstery_color: '',
            upholstery_unit: '',
            upholstery_width: null,
            upholstery_horizontal: null,
            upholstery_vertical: null,
            upholstery_content: '',
            upholstery_backing: '',
            upholstery_qty: null,

            //Window Treatment
            wt_unit: '',
            wt_len_window: null,
            wt_wid_window: null,
            wt_height_window: null,
            wt_mount: '',
            wt_valance: '',
            wt_vendor_provided_fabric: '',
            wt_fabric: '',
            wt_com_fabric: '',
            wt_pattern_name: '',
            wt_sku: '',
            wt_color: '',
            wt_horizontal: null,
            wt_vertical: null,
            wt_content: '',
            wt_backing: '',
            wt_installation_type: '',
            wt_type: '',
            wt_drapery_style: '',
            wt_drapery_fullness: '',
            wt_drapery_hem: '',
            wt_drapery_construction: '',
            wt_drapery_control: '',
            wt_drapery_control_location: '',
            wt_drapery_hardware: '',
            wt_drapery_blackout_linear: '',
            wt_shade_style: '',
            wt_shade_fullness: '',
            wt_shade_hem: '',
            wt_shade_construction: '',
            wt_shade_control_type: '',
            wt_shade_control_location: '',
            wt_shade_hardware: '',
            wt_shade_blackout_linear: '',



        });
        setSelectedFile(null);
        setFileName('');
    };

    const fetchVendorsNames = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getvendornames`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVendors(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchFurnishingType = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/configuration/` + GlobalVariable.ConfigurationType.Furnishing, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFurnishingType(response.data.configuration);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchRFQDetails = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/rfqDetails/${addressID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (isEditMode) {                
                const filteredRfqs = response.data.allRFQs.filter(rfq =>
                    rfq.status === "Received RFQ" && 
                    rfq.products.some(product => product.productId === editItem._id)
                );
                setRfqs(filteredRfqs);
            }
            else{
                setRfqs([])
            }


            
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchVendorsNames();
        fetchFurnishingType();
        fetchRFQDetails();
    }, []);

    if (error) return (
        <div className="w-full flex items-center justify-center text-red-600 font-medium">
            Error: {error}
        </div>
    );

    formData.po_amount = (Number(formData.qty || 0) * Number(formData.net_cost || 0)) + Number(formData.other_cost || 0);
    formData.buy_sales_tax = (Number(formData.po_amount || 0) * (formData.buy_tax/100));
    formData.client_product_cost = (Number(formData.net_cost || 0) * (1 + (Number(formData.sell_markup || 0)/100)) )
    formData.client_price = (Number(formData.client_product_cost || 0) * (formData.qty));
    formData.sell_sales_tax = (Number(formData.client_price || 0) * (Number(formData.sell_tax || 0)/100));

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4'>
            <div className="w-full flex items-center justify-center gap-4">
                { isEditMode ? 
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="code">Furnishing:</label>
                        <label className='p-1'>
                            {formData.furnishing}
                        </label>  
                    </div>               
                    :
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="code">Furnishing:</label>
                        <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                        <select
                            value={formData.furnishing}
                            onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            name='furnishing'
                        >
                            <option value="" disabled>Select an option</option>
                            {FurnishingType.map((option) => (
                            <option key={option.code} value={option.name}>
                                {option.name}
                            </option>
                            ))}
                        </select>
                    </div> 
                }       
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="name">Product Name:</label>
                    <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                    <input value={formData.name} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='name' placeholder='Type here...' maxLength="100" />
                </div>                           
                {/* <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="code">Item Code:</label>
                    <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                    <input value={formData.code} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='code' placeholder='Type here...' />
                </div> */}
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="name">SKU:</label>
                    <input value={formData.sku} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='sku' placeholder='Type here...' maxLength="50" />
                </div>                           
            </div>
            {
                formData.furnishing === 'Accessory' ? (
                        <Accessory
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />                    
                )  : formData.furnishing === 'Area Rug' ? (
                        <Arearug                           
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />   
                )  : formData.furnishing === 'Equipment' ? (
                        <Equipment 
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Hardware' ? (
                        <Hardware 
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Artwork' ? (
                        <Artwork
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Casegood' ? (
                        <Casegood
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Fabric' ? (
                        <Fabric
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Light Fixture (hardwired)' ? (
                        <Hardwired
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Decorative Lighting' ? (
                        <DecorativeLighting
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Mirror' ? (
                        <Mirror
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Miscellaneous' ? (
                        <Miscellaneous
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Table' ? (
                        <Table
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />                
                )  :  formData.furnishing === 'Seating' ? (
                        <Seating
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Wallpaper' ? (
                        <Wallpaper
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Upholstery' ? (
                        <Upholstery
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                )  :  formData.furnishing === 'Window Treatment' ? (
                        <WindowTreatment
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />
                ) : 
                (
                    <div></div>
                )
            }

            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                <label htmlFor="qty">Quantity:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <input value={formData.qty} onChange={handleInputChange}
                    className='w-full max-w-[40%] outline-none border-b border-solid border-b-black p-[2px]'
                    type="number" name='qty' placeholder='Type here...' maxLength="5"/>
            </div>

            <div className="h-[20px] bg-gray-300"></div>
            <div className="w-full flex items-center justify-start font-semibold">Buy Price</div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="rfq">RFQ Document:</label>
                    <select
                            value={formData.rfq}
                            onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            name='rfq'
                        >
                            <option value="" disabled>Select an option</option>
                            {rfqs.map((option) => (
                            <option key={option.rfqId} value={option.rfqId}>
                                {option.rfqId}
                            </option>
                            ))}
                    </select>
                </div>                           
            </div>
            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="vendor">Vendor :</label>
                <div>{formData.vendor}</div>
            </div>

            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="net_cost">Net Cost ($):</label>
                <div>{formData.net_cost}</div>
            </div>
            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="shipping_cost">Shipping Cost ($):</label>
                <input value={formData.shipping_cost} onChange={handleInputChange}
                    className='w-full max-w-[40%] outline-none border-b border-solid border-b-black p-[2px]'
                    type="number" name='shipping_cost' placeholder='Type here...' maxLength="20"/>
            </div>            

            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="other_cost">Other Cost ($):</label>
                <input value={formData.other_cost} onChange={handleInputChange}
                    className='w-full max-w-[40%] outline-none border-b border-solid border-b-black p-[2px]'
                    type="number" name='other_cost' placeholder='Type here...' maxLength="20"/>
            </div> 

            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="po_amount">PO Amount ($):</label>
                <div>{formData.po_amount}</div>
            </div> 


            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="buy_tax">Tax (%):</label>
                <input value={formData.buy_tax} onChange={handleInputChange}
                    className='w-full max-w-[40%] outline-none border-b border-solid border-b-black p-[2px]'
                    type="number" name='buy_tax' placeholder='Type here...' maxLength="3"/>
            </div>    

            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="buy_sales_tax">Sales Tax ($):</label>
                <div>{formData.buy_sales_tax}</div>
            </div> 

            <div className="h-[20px] bg-gray-300"></div>
            <div className="w-full flex items-center justify-start font-semibold">Sell Price</div>
            
            
            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="sell_markup">Markup (%):</label>
                <input value={formData.sell_markup} onChange={handleInputChange}
                    className='w-full max-w-[40%] outline-none border-b border-solid border-b-black p-[2px]'
                    type="number" name='sell_markup' placeholder='Type here...' maxLength="3"/>
            </div>    

            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="client_product_cost">Client Product Cost ($):</label>
                <div>{formData.client_product_cost}</div>
            </div>  

            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="client_price">Client Price ($):</label>
                <div>{formData.client_price}</div>
            </div>  

            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="sell_tax">Tax (%):</label>
                <input value={formData.sell_tax} onChange={handleInputChange}
                    className='w-full max-w-[40%] outline-none border-b border-solid border-b-black p-[2px]'
                    type="number" name='sell_tax' placeholder='Type here...' maxLength="3"/>
            </div>    
            
            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="sell_sales_tax">Sales Tax ($):</label>
                <div>{formData.sell_sales_tax}</div>
            </div>            

            <div className="w-full flex items-start justify-start gap-2 text-black">
                <label htmlFor="file">Attachment <span className='text-sm'>(Image only)</span>:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <input type="file" onChange={handleFileChange} name='file' accept="image/*" />
            </div>

            {fileName && <div className="w-full text-left text-sm">Uploaded file: {fileName}</div>}

            <button type="submit" className='w-full p-1.5 rounded-lg bg-[#7F55DE] text-white font-medium'>
                {isEditMode ? 'Update Item' : 'Add Item'}
            </button>
        </form>
    );
};

const ProjectItem = ({ name, id, isOpen, handleOpen, handleClose, addressID, fetchSections, client, ConfigurationType, Progress }) => {
    const loggedInUser = localStorage.getItem('name');

    const token = localStorage.getItem('token');

    const options = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    const [type, setType] = useState('ref');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [comments, setComments] = useState({});
    const [editItem, setEditItem] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleChange = (e) => {
        setType(e.target.value);
    };

    const handleInputChange = (e, _id) => {
        const { name, value } = e.target;
        setComments(prevComments => ({
            ...prevComments,
            [_id]: {
                ...prevComments[_id],
                [name]: value
            }
        }));
    };

    const resetCommentForm = (_id) => {
        setComments(prevComments => ({
            ...prevComments,
            [_id]: {
                name: loggedInUser,
                body: ''
            }
        }));
    };

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/allProducts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoading(false);
            setProducts(response.data.allProducts);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const createNewComment = async (e, _id) => {
        e.preventDefault();
        if (comments[_id].body.length === 0) {
            toast.error("Can't submit empty comment!");
        }
        try {
            if (comments[_id].body.length > 0) {
                const response = await axios.put(`${backendServer}/api/product/${id}/${loggedInUser}/newComment/${_id}`, comments[_id]);
                toast.success(response.data.message);
                resetCommentForm(_id);
                fetchProductDetails();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setIsEditMode(true);
        handleOpen();
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await axios.delete(`${backendServer}/api/product/${id}`);
            toast.success(response.data.message);
            fetchProductDetails();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const deleteSection = async (id) => {
        try {
            const response = await axios.delete(`${backendServer}/api/deleteSection/${id}`);
            toast.success(response.data.message);
            fetchSections();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const [imgModal, setImgModal] = useState(false);
    const [showImageUrl, setShowImageUrl] = useState(null);

    const handleImgModal = () => { setShowImageUrl(null); setImgModal(curr => !curr); };

    const showImage = (url) => {
        handleImgModal();
        setShowImageUrl(url);
    };

    useEffect(() => {
        fetchProductDetails();
    }, []);

    return (
        <div className="w-full flex items-center justify-center bg-[#F8F9FD] p-4">
            <div className="w-full flex flex-col items-center justify-start gap-3 p-4 bg-white">
                <div className="w-full flex items-center justify-between text-gray-900 text-[1.325rem] font-semibold">
                    <div>{name}</div>
                    {
                        (Progress == GlobalVariable.Progress.InProgress || Progress == GlobalVariable.Progress.DesignRejected || Progress == GlobalVariable.Progress.ProposalRejected) && 
                            <MdDeleteOutline onClick={() => deleteSection(id)} className='text-3xl text-red-600 cursor-pointer' />}
                </div>
                <div className="w-full h-[2px] bg-gray-300"></div>
                <div className="w-full flex items-center justify-between">
                    <div className='text-black font-medium text-lg'>Project Items</div>
                    {
                        (Progress == GlobalVariable.Progress.InProgress || Progress == GlobalVariable.Progress.DesignRejected || Progress == GlobalVariable.Progress.ProposalRejected) && 
                        <button onClick={() => { setIsEditMode(false); handleOpen(); }}
                            type="button" className='w-fit bg-[#7F55DE] p-2 px-3 text-white text-base font-medium rounded-lg flex items-center justify-center gap-2'>
                            <IoMdAdd className='text-xl' />
                        </button>
                    }
                </div>
                <div className="w-full flex flex-col items-center justify-start border-2 border-solid border-gray-300 rounded-lg p-3 gap-3">
                    {
                        products.length === 0 ? (
                            <div className='w-full flex items-center justify-start text-black font-medium'>No product details found!</div>
                        ) : (
                            products.map(pdt => (
                                <div key={pdt._id} className="w-full flex flex-col items-center gap-3 border-2 border-solid border-gray-300 rounded-lg p-3">
                                     {
                                        (Progress == GlobalVariable.Progress.InProgress || Progress == GlobalVariable.Progress.DesignRejected || Progress == GlobalVariable.Progress.ProposalRejected) && 
                                    
                                        <div className="w-full flex items-center justify-end gap-1">
                                            <FaEdit onClick={() => handleEdit(pdt)} className='text-xl cursor-pointer' />
                                            <MdDeleteOutline onClick={() => handleDeleteItem(pdt._id)} className='text-2xl text-red-600 cursor-pointer' />
                                        </div>}
                                    <Dialog
                                        size='md'
                                        open={imgModal}
                                        handler={handleImgModal}
                                        className="bg-transparent shadow-none w-full flex items-center justify-center"
                                    >
                                        <div className="w-full flex items-center justify-center bg-white p-4 rounded-lg text-black">
                                            <img className='w-full aspect-auto' src={showImageUrl} alt="" />
                                        </div>
                                    </Dialog>
                                    {
                                        pdt.type === 'Reference' ?
                                            (
                                                <div className="w-full flex items-start justify-center gap-3 text-black">
                                                    <div style={{scrollbarWidth: 'thin'}} className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2 h-[20rem] overflow-y-scroll scroll-smooth">
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <span className='font-semibold'>{pdt.type}:</span>
                                                            <span>{pdt.title}</span>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        <img onClick={() => showImage(pdt.imageUrl)} className='max-w-[15rem] cursor-pointer' src={pdt.imageUrl} alt="" />
                                                    </div>
                                                    <div style={{scrollbarWidth: 'thin'}} className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2 h-[20rem] overflow-y-scroll scroll-smooth">
                                                        <div className="w-full flex items-center justify-start font-semibold">Description</div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        <div className="w-full flex items-center justify-start">{pdt.desc}</div>
                                                    </div>
                                                    <div style={{scrollbarWidth: 'thin'}} className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2 h-[20rem] overflow-y-scroll scroll-smooth">
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="font-semibold">Comments</div>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        {
                                                            pdt.comments.length === 0 ?
                                                                <div className="w-full items-center justify-start">No comment yet!</div> :
                                                                pdt.comments.map(comment => (
                                                                    <div key={comment._id} className="w-full flex flex-col items-center bg-[#F8F9FD] gap-1">
                                                                        <div className="w-full flex items-center justify-start p-2 text-base font-medium gap-2">
                                                                            <FaUserCircle className='text-xl' />
                                                                            <div>{comment.name}</div>
                                                                            <div className='text-sm'>{new Intl.DateTimeFormat('en-US', options).format(new Date(comment.createdAt))}</div>
                                                                        </div>
                                                                        <div className="w-full flex items-center justify-start p-2 bg-white">{comment.body}</div>
                                                                    </div>
                                                                ))
                                                        }
                                                        <form onSubmit={(e) => createNewComment(e, pdt._id)} className="w-full flex items-start gap-3 mt-4">
                                                            <textarea
                                                                value={comments[pdt._id]?.body || ''}
                                                                onChange={(e) => handleInputChange(e, pdt._id)}
                                                                className='w-full p-2 border border-solid border-gray-300 outline-none'
                                                                placeholder='Type here...'
                                                                name="body"
                                                            ></textarea>
                                                            <button
                                                                type="submit"
                                                                className='w-fit bg-[#7F55DE] p-1.5 px-3 text-white text-base font-medium rounded-lg'
                                                            >
                                                                Send
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            ) :
                                            (
                                                <div className="w-full flex items-start justify-center gap-3 text-black">
                                                    <div style={{scrollbarWidth: 'thin'}} className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2 h-[20rem] overflow-y-scroll scroll-smooth">
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <span className='font-semibold'>{pdt.type}:</span>
                                                            <span>{pdt.title} ({pdt.code})</span>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        <img onClick={() => showImage(pdt.imageUrl)} className='max-w-[15rem] cursor-pointer' src={pdt.imageUrl} alt="" />
                                                    </div>

                                                    <div style={{scrollbarWidth: 'thin'}} className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2 h-[20rem] overflow-y-scroll scroll-smooth">
                                                        <div className="w-full flex items-center justify-start font-semibold">Description</div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>SKU:</div>
                                                            <div>{pdt.sku}</div>
                                                        </div>                                                        
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Quantity:</div>
                                                            <div>{pdt.qty}</div>
                                                        </div>
                                                            {pdt.furnishing === 'Accessory' ? (
                                                                <ViewAcessory
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Area Rug' ? (
                                                                <ViewArearug
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Equipment' ? (
                                                                <ViewEquipment
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Hardware' ? (
                                                                <ViewHardware
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Artwork' ? (
                                                                <ViewArtwork
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Casegood' ? (
                                                                <ViewCasegood
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Fabric' ? (
                                                                <ViewFabric
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Light Fixture (hardwired)' ? (
                                                                <ViewHardwired
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Decorative Lighting' ? (
                                                                <ViewDecorativeLighting
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Mirror' ? (
                                                                <ViewMirror
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Miscellaneous' ? (
                                                                <ViewMiscellaneous
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Table' ? (
                                                                <ViewTable
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Seating' ? (
                                                                <ViewSeating
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Wallpaper' ? (
                                                                <ViewWallpaper
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Upholstery' ? (
                                                                <ViewUpholstery
                                                                    pdt={pdt}
                                                                />
                                                            )   : pdt.furnishing === 'Window Treatment' ? (
                                                                <ViewWindowTreatment
                                                                    pdt={pdt}
                                                                />                      
                                                            )   
                                                            
                                                            
                                                            : <></>
                                                            }
                                                        <div className="h-[20px] bg-gray-300"></div>
                                                        <div className="w-full flex items-center justify-start font-semibold">Buy Price</div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>RFQ :</div>
                                                            <div>{pdt.rfq}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Vendor ($):</div>
                                                            <div>{pdt.vendor}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Net Cost ($):</div>
                                                            <div>{pdt.net_cost}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Shipping Cost ($):</div>
                                                                <div>{pdt.shipping_cost}</div>
                                                            </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Other Cost ($):</div>
                                                                <div>{pdt.other_cost}</div>
                                                            </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Po Amount ($):</div>
                                                                <div>{pdt.po_amount}</div>
                                                            </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Tax (%):</div>
                                                                <div>{pdt.buy_tax}</div>
                                                            </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Sales Tax ($):</div>
                                                                <div>{pdt.buy_sales_tax}</div>
                                                            </div>
                                                        <div className="h-[20px] bg-gray-300"></div>
                                                        <div className="w-full flex items-center justify-start font-semibold">Sales Price</div>    
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Sell Markup (%):</div>
                                                                <div>{pdt.sell_markup}</div>
                                                            </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Client_Product Cost ($):</div>
                                                                <div>{pdt.client_product_cost}</div>
                                                            </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Client Price ($):</div>
                                                                <div>{pdt.client_price}</div>
                                                            </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Sell Tax (%):</div>
                                                                <div>{pdt.sell_tax}</div>
                                                            </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                <div className='font-medium'>Sell_Sales Tax ($):</div>
                                                                <div>{pdt.sell_sales_tax}</div>
                                                            </div>
                                                    </div>

                                                    <div style={{scrollbarWidth: 'thin'}} className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2 h-[20rem] overflow-y-scroll scroll-smooth">
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="font-semibold">Comments</div>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        {
                                                            pdt.comments.length === 0 ?
                                                                <div className="w-full items-center justify-start">No comment yet!</div> :
                                                                pdt.comments.map(comment => (
                                                                    <div key={comment._id} className="w-full flex flex-col items-center bg-[#F8F9FD] gap-1">
                                                                        <div className="w-full flex items-center justify-start p-2 text-base font-medium gap-2">
                                                                            <FaUserCircle className='text-xl' />
                                                                            <div>{comment.name}</div>
                                                                            <div className='text-sm'>{new Intl.DateTimeFormat('en-US', options).format(new Date(comment.createdAt))}</div>
                                                                        </div>
                                                                        <div className="w-full flex items-center justify-start p-2 bg-white">{comment.body}</div>
                                                                    </div>
                                                                ))
                                                        }
                                                        <form onSubmit={(e) => createNewComment(e, pdt._id)} className="w-full flex items-start gap-3 mt-4">
                                                            <textarea
                                                                value={comments[pdt._id]?.body || ''}
                                                                onChange={(e) => handleInputChange(e, pdt._id)}
                                                                className='w-full p-2 border border-solid border-gray-300 outline-none'
                                                                placeholder='Type here...'
                                                                name="body"
                                                            ></textarea>
                                                            <button
                                                                type="submit"
                                                                className='w-fit bg-[#7F55DE] p-1.5 px-3 text-white text-base font-medium rounded-lg'
                                                            >
                                                                Send
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            )
                                    }
                                </div>
                            ))
                        )
                    }
                </div>
                <Dialog
                    // size={`${type === "ref" || editItem.type === 'Reference' ? "xs" : "md"}`}
                    size='md'
                    open={isOpen}
                    handler={handleClose}
                    className="bg-transparent shadow-none w-full flex items-center justify-center"
                >
                     <div className="w-full max-h-[80vh] overflow-y-auto flex flex-col items-center justify-start gap-3 bg-white p-4 rounded-lg text-black">
                        <div className='w-full flex items-center justify-start text-lg font-semibold'>{isEditMode ? 'Edit Project Item' : 'Add Project Items'}</div>
                        {!isEditMode ? <div className="w-full h-[1.5px] bg-black"></div> : null}
                        {!isEditMode && (
                            <div className="w-full flex items-center justify-start gap-16">
                                <div className='-mr-12 text-black font-medium'>Type:</div>
                                <div className="flex items-center justify-center gap-2">
                                    <input
                                        className=''
                                        type="checkbox"
                                        value="ref"
                                        checked={type === "ref"}
                                        onChange={handleChange}
                                    />
                                    <div className="text-gray-800">Reference</div>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <input
                                        className=''
                                        type="checkbox"
                                        value="pdt"
                                        checked={type === "pdt"}
                                        onChange={handleChange}
                                    />
                                    <div className="text-gray-800">Product</div>
                                </div>
                            </div>
                        )}
                        <div className="w-full h-[1.5px] bg-black"></div>
                        {
                            (type === 'ref' && !isEditMode) || (isEditMode && editItem?.type === 'Reference') ? (
                                <RefForm
                                    id={id}
                                    fetchDetails={fetchProductDetails}
                                    handleClose={handleClose}
                                    editItem={editItem}
                                    isEditMode={isEditMode}
                                />
                            ) : (
                                <PdtForm
                                    id={id}
                                    fetchDetails={fetchProductDetails}
                                    handleClose={handleClose}
                                    editItem={editItem}
                                    isEditMode={isEditMode}
                                    client={client}
                                    secName={name}
                                    ConfigurationType={ConfigurationType}
                                    products={products}
                                    addressID={addressID}
                                />
                            )
                        }
                    </div>
                </Dialog>

            </div>
        </div>
    );
};

export default ProjectItem;