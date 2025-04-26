import { createListing } from "../services/listing.service.js";
import { getPlanById } from "../services/plan.service.js";

export const createListingController  = async (req, res) => {
  try {
    const { planId } = req.params;

    // Check if the plan exists
    const plan = await getPlanById(planId);
    if (!plan) {
      return res.status(404).json({success:false, message: "Plan not found" });
    }

    const {
      businessName,
      phone,
      category,
      address,
      city,
      state,
      pincode,
      website,
      description,
      logo,
      image,
      video,
      faq,
      sociallinks,
      business_hour,
      email_owner,
      video_link,
      tagline,
      custom_fields,
      payment_status,
      gallery_images,
      tags,
      profileImage,
      price_details,
    } = req.body;

    const user_id = req.user?.id || req.body.user_id;

      // Validate required fields
      if (!businessName || !category || !city || !state) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      const newListingId = await createListing({
        plan_id: planId,
        user_id,
        business_name:businessName,
        phone,
        category,
        address,
        city,
        state,
        pincode,
        website,
        description,
        logo,
        image,
        video,
        faq,
        sociallinks,
        business_hour,
        email_owner,
        video_link,
        tagline,
        custom_fields,
        payment_status,
        gallery_images,
        tags,
        profileImage,
        price_details,
      });
  
      res.status(201).json({
        success: true,
        message: "Listing created successfully",
        listingId: newListingId,
      });



  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({ message: "Something went wrong while creating the listing" });
  }
};
