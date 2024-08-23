// models/Product.js
class Product {
    constructor(data) {
        this.projectId = data.projectId || null;
        this.code = data.code || null;
        this.sku = data.sku || null;
        this.furnishing = data.furnishing || null;
        this.qty = data.qty || null;
        this.type = data.type || null;
        this.title = data.title || null;
        this.desc = data.desc || null;
        this.qty = data.qty || null;
        this.rfq = data.rfq || null;
        this.vendor = data.vendor || null;
        this.net_cost = data.net_cost || null;
        this.shipping_cost = data.shipping_cost || null;
        this.other_cost = data.other_cost || null;
        this.po_amount = data.po_amount || null;
        this.buy_tax = data.buy_tax || null;
        this.buy_sales_tax = data.buy_sales_tax || null;
        this.sell_markup = data.sell_markup || null;
        this.client_product_cost = data.client_product_cost || null;
        this.client_price = data.client_price || null;
        this.sell_tax = data.sell_tax || null;
        this.sell_sales_tax = data.sell_sales_tax || null;
        this.productDetails = data.productDetails || null;
        this.imageUrl = data.imageUrl || null;
        this.status = data.status || null;
        this.rfqNumber = data.rfqNumber || null;
        this.price = data.price || null;
        this.rfqSentDate = data.rfqSentDate || null;
        this.rfqReceiveDate = data.rfqReceiveDate || null;
        this.poNumber = data.poNumber || null;
        this.poSentDate = data.poSentDate || null;              
        
        // Dynamically set productDetails based on furnishing type
        this.productDetails = this.getProductDetails(data);
    }

    getProductDetails(data) {
        switch (data.furnishing) {
            case 'Accessory':
                return {
                    acessory_unit: data.acessory_unit || null,
                    acessory_len: data.acessory_len || null,
                    acessory_wid: data.acessory_wid || null,
                    acessory_height: data.acessory_height || null,
                    acessory_color: data.acessory_color || null,
                    acessory_finish: data.acessory_finish || null,
                };
            case 'Area Rug':
                return {
                    arearug_unit: data.arearug_unit || null,
                    arearug_len: data.arearug_len || null,
                    arearug_wid: data.arearug_wid || null,
                    arearug_rugpad: data.arearug_rugpad || null,
                    arearug_content: data.arearug_content || null,
                    arearug_custom: data.arearug_custom || null,
                    arearug_color: data.arearug_color || null,
                    arearug_gauge: data.arearug_gauge || null,
                    arearug_pile: data.arearug_pile || null,
                    arearug_stitches: data.arearug_stitches || null,
                    arearug_pattern: data.arearug_pattern || null,
                    arearug_construction: data.arearug_construction || null,
                    arearug_backing: data.arearug_backing || null,
                    arearug_secondaryBacking: data.arearug_secondaryBacking || null,
                };
            case 'Equipment':
                return {
                    equipment_unit: data.equipment_unit || null,
                    equipment_len: data.equipment_len || null,
                    equipment_wid: data.equipment_wid || null,
                    equipment_height: data.equipment_height || null,
                    equipment_color: data.equipment_color || null,
                    equipment_finish: data.equipment_finish || null,                    
                };
            case 'Hardware':
                return {
                    hardware_unit: data.hardware_unit || null,
                    hardware_len: data.hardware_len || null,
                    hardware_wid: data.hardware_wid || null,
                    hardware_height: data.hardware_height || null,
                    hardware_color: data.hardware_color || null,
                    hardware_finish: data.hardware_finish || null,
                };
            case 'Artwork':
                return {
                    artwork_len_overall: data.artwork_len_overall || null,
                    artwork_wid_overall: data.artwork_wid_overall || null,
                    artwork_height_overall: data.artwork_height_overall || null,
                    artwork_wid_frame: data.artwork_wid_frame || null,
                    artwork_height_frame: data.artwork_height_frame || null,
                    artwork_len_artwork: data.artwork_len_artwork || null,
                    artwork_wid_artwork: data.artwork_wid_artwork || null,
                    artwork_medium: data.artwork_medium || null,
                    artwork_frame_item: data.artwork_frame_item || null,
                    artwork_frame_material: data.artwork_frame_material || null,
                    artwork_frame_finish: data.artwork_frame_finish || null,
                    artwork_mat_color: data.artwork_mat_color || null,
                    artwork_mat_size: data.artwork_mat_size || null,
                    artwork_orientation: data.artwork_orientation || null,
                    artwork_glass: data.artwork_glass || null,
                    artwork_mounting_hardware: data.artwork_mounting_hardware || null,
                };
            case 'Casegood':
                return {
                    casegood_unit: data.casegood_unit || null,
                    casegood_len: data.casegood_len || null,
                    casegood_wid: data.casegood_wid || null,
                    casegood_height: data.casegood_height || null,
                    casegood_top: data.casegood_top || null,
                    casegood_finish: data.casegood_finish || null,
                    casegood_outlet: data.casegood_outlet || null,
                    casegood_hardware: data.casegood_hardware || null,
                    casegood_installation_type: data.casegood_installation_type || null,
                };
            case 'Fabric':
                return {
                    fabric_color: data.fabric_color || null,
                    fabric_unit: data.fabric_unit || null,
                    fabric_width: data.fabric_width || null,
                    fabric_horizontal: data.fabric_horizontal || null,
                    fabric_vertical: data.fabric_vertical || null,
                    fabric_content: data.fabric_content || null,
                    fabric_backing: data.fabric_backing || null,
                    fabric_cfa_required: data.fabric_cfa_required || null,
                    fabric_cfa_waived: data.fabric_cfa_waived || null,
                };
            case 'Light Fixture (hardwired)':
                return {
                    hardwired_unit: data.hardwired_unit || null,
                    hardwired_len_overall: data.hardwired_len_overall || null,
                    hardwired_wid_overall: data.hardwired_wid_overall || null,
                    hardwired_height_overall: data.hardwired_height_overall || null,
                    hardwired_len_fixture: data.hardwired_len_fixture || null,
                    hardwired_wid_fixture: data.hardwired_wid_fixture || null,
                    hardwired_height_fixture: data.hardwired_height_fixture || null,
                    hardwired_len_shade: data.hardwired_len_shade || null,
                    hardwired_wid_shade: data.hardwired_wid_shade || null,
                    hardwired_height_shade: data.hardwired_height_shade || null,
                    hardwired_color: data.hardwired_color || null,
                    hardwired_finish: data.hardwired_finish || null,
                    hardwired_base_material: data.hardwired_base_material || null,
                    hardwired_shade_material: data.hardwired_shade_material || null,
                    hardwired_shade_type: data.hardwired_shade_type || null,
                    hardwired_switch_type: data.hardwired_switch_type || null,
                    hardwired_quantity: data.hardwired_quantity || null,
                    hardwired_socket_type: data.hardwired_socket_type || null,
                    hardwired_dimmable: data.hardwired_dimmable || null,
                    hardwired_switch: data.hardwired_switch || null,
                    hardwired_wattaga: data.hardwired_wattaga || null,
                    hardwired_temperature: data.hardwired_temperature || null,
                    hardwired_rating: data.hardwired_rating || null,
                    hardwired: data.hardwired || null,
                };
            case 'Decorative Lighting':
                return {
                    decorative_lighting_unit: data.decorative_lighting_unit || null,
                    decorative_lighting_len_overall: data.decorative_lighting_len_overall || null,
                    decorative_lighting_wid_overall: data.decorative_lighting_wid_overall || null,
                    decorative_lighting_height_overall: data.decorative_lighting_height_overall || null,
                    decorative_lighting_len_fixture: data.decorative_lighting_len_fixture || null,
                    decorative_lighting_wid_fixture: data.decorative_lighting_wid_fixture || null,
                    decorative_lighting_height_fixture: data.decorative_lighting_height_fixture || null,
                    decorative_lighting_len_shade: data.decorative_lighting_len_shade || null,
                    decorative_lighting_wid_shade: data.decorative_lighting_wid_shade || null,
                    decorative_lighting_height_shade: data.decorative_lighting_height_shade || null,
                    decorative_lighting_color: data.decorative_lighting_color || null,
                    decorative_lighting_finish: data.decorative_lighting_finish || null,
                    decorative_lighting_base_material: data.decorative_lighting_base_material || null,
                    decorative_lighting_shade_material: data.decorative_lighting_shade_material || null,
                    decorative_lighting_shade_type: data.decorative_lighting_shade_type || null,
                    decorative_lighting_switch_type: data.decorative_lighting_switch_type || null,
                    decorative_lighting_quantity: data.decorative_lighting_quantity || null,
                    decorative_lighting_socket_type: data.decorative_lighting_socket_type || null,
                    decorative_lighting_dimmable: data.decorative_lighting_dimmable || null,
                    decorative_lighting_switch: data.decorative_lighting_switch || null,
                    decorative_lighting_wattaga: data.decorative_lighting_wattaga || null,
                    decorative_lighting_temperature: data.decorative_lighting_temperature || null,
                    decorative_lighting_rating: data.decorative_lighting_rating || null,                    
                };                
            case 'Mirror':
                return {
                    mirror_unit: data.mirror_unit || null,
                    mirror_len: data.mirror_len || null,
                    mirror_wid: data.mirror_wid || null,
                    mirror_height: data.mirror_height || null,
                    mirror_color: data.mirror_color || null,
                    mirror_finish: data.mirror_finish || null,
                    mirror_orientation: data.mirror_orientation || null,
                    mirror_glass: data.mirror_glass || null,
                    mirror_mounting_hardware: data.mirror_mounting_hardware || null,                    
                };
            case 'Miscellaneous':
                return {
                    miscellaneous_fabrication_style: data.miscellaneous_fabrication_style || null,
                    miscellaneous_pattern: data.miscellaneous_pattern || null,
                    miscellaneous_insert: data.miscellaneous_insert || null,
                };
            case 'Table':
                return {
                    table_unit: data.table_unit || null,
                    table_len: data.table_len || null,
                    table_wid: data.table_wid || null,
                    table_height: data.table_height || null,
                    table_other_dimension: data.table_other_dimension || null,
                    table_top: data.table_top || null,
                    table_finish: data.table_finish || null,
                    table_hardware: data.table_hardware || null,
                };
            case 'Seating':
                return {
                    seating_unit: data.seating_unit || null,
                    seating_len: data.seating_len || null,
                    seating_wid: data.seating_wid || null,
                    seating_height: data.seating_height || null,
                    seating_color: data.seating_color || null,
                    seating_finish: data.seating_finish || null,
                    seating_vendor_provided_fabric: data.seating_vendor_provided_fabric || null,
                    seating_fabric: data.seating_fabric || null,
                    seating_com_fabric: data.seating_com_fabric || null,
                    seating_pattern_name: data.seating_pattern_name || null,
                    seating_sku: data.seating_sku || null,
                    seating_width: data.seating_width || null,
                    seating_horizontal: data.seating_horizontal || null,
                    seating_vertical: data.seating_vertical || null,
                    seating_content: data.seating_content || null,
                    seating_backing: data.seating_backing || null,
                    seating_qty: data.seating_qty || null,                    
                };
            case 'Wallpaper':
                return {
                    wallpaper_color: data.wallpaper_color || null,
                    wallpaper_unit: data.wallpaper_unit || null,
                    wallpaper_width: data.wallpaper_width || null,
                    wallpaper_horizontal: data.wallpaper_horizontal || null,
                    wallpaper_vertical: data.wallpaper_vertical || null,
                    wallpaper_content: data.wallpaper_content || null,
                    wallpaper_type: data.wallpaper_type || null,
                    wallpaper_weight: data.wallpaper_weight || null,
                    wallpaper_backing: data.wallpaper_backing || null,
                    wallpaper_installation: data.wallpaper_installation || null,                    
                };
            case 'Upholstery':
                return {
                    upholstery_color: data.upholstery_color || null,
                    upholstery_unit: data.upholstery_unit || null,
                    upholstery_width: data.upholstery_width || null,
                    upholstery_horizontal: data.upholstery_horizontal || null,
                    upholstery_vertical: data.upholstery_vertical || null,
                    upholstery_content: data.upholstery_content || null,
                    upholstery_backing: data.upholstery_backing || null,
                    upholstery_qty: data.upholstery_qty || null,                    
                };
            case 'Window Treatment':
                return {
                    wt_unit: data.wt_unit || null,
                    wt_len_window: data.wt_len_window || null,
                    wt_wid_window: data.wt_wid_window || null,
                    wt_height_window: data.wt_height_window || null,
                    wt_mount: data.wt_mount || null,
                    wt_valance: data.wt_valance || null,
                    wt_vendor_provided_fabric: data.wt_vendor_provided_fabric || null,
                    wt_fabric: data.wt_fabric || null,
                    wt_com_fabric: data.wt_com_fabric || null,
                    wt_pattern_name: data.wt_pattern_name || null,
                    wt_sku: data.wt_sku || null,
                    wt_color: data.wt_color || null,
                    wt_horizontal: data.wt_horizontal || null,
                    wt_vertical: data.wt_vertical || null,
                    wt_content: data.wt_content || null,
                    wt_backing: data.wt_backing || null,
                    wt_installation_type: data.wt_installation_type || null,
                    wt_type: data.wt_type || null,
                    wt_drapery_style: data.wt_drapery_style || null,
                    wt_drapery_fullness: data.wt_drapery_fullness || null,
                    wt_drapery_hem: data.wt_drapery_hem || null,
                    wt_drapery_construction: data.wt_drapery_construction || null,
                    wt_drapery_control: data.wt_drapery_control || null,
                    wt_drapery_control_location: data.wt_drapery_control_location || null,
                    wt_drapery_hardware: data.wt_drapery_hardware || null,
                    wt_drapery_blackout_linear: data.wt_drapery_blackout_linear || null,
                    wt_shade_style: data.wt_shade_style || null,
                    wt_shade_fullness: data.wt_shade_fullness || null,
                    wt_shade_hem: data.wt_shade_hem || null,
                    wt_shade_construction: data.wt_shade_construction || null,
                    wt_shade_control_type: data.wt_shade_control_type || null,
                    wt_shade_control_location: data.wt_shade_control_location || null,
                    wt_shade_hardware: data.wt_shade_hardware || null,
                    wt_shade_blackout_linear: data.wt_shade_blackout_linear || null,
                    
                };                                   
                                                  
            // Add more cases as needed
            default:
                return {};
        }
    }
}

export default Product;
