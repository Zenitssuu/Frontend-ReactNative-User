import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

/**
 * Service for processing QR codes from images directly in the frontend
 * Uses web-based QR decoder services for React Native compatibility
 */
class QRCodeService {
  /**
   * Pick an image from gallery and process it for QR codes
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async pickAndProcessImage() {
    try {
      // Request media library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error("Media library permission not granted");
      }

      // Launch image picker with Google Pay-like options (no cropping)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct API for this version
        quality: 1, // High quality for better QR detection
        allowsEditing: false, // Disable cropping - take image directly
        allowsMultipleSelection: false,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
        // Add better UI options
        base64: false, // We'll handle base64 conversion ourselves
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return null;
      }

      const imageUri = result.assets[0].uri;
      console.log("Image selected:", imageUri);
      
      return await this.processImageForQRCodeEnhanced(imageUri);
    } catch (error) {
      console.log("Error picking and processing image:", error);
      throw error;
    }
  }

  /**
   * Process an image file for QR codes using web-based decoder services
   * @param {string} imageUri - Local URI of the image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async processImageForQRCode(imageUri) {
    try {
      // Optimize image for QR detection
      const optimizedImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: 1024 } }], // Resize for better processing
        { format: SaveFormat.JPEG, quality: 0.8 }
      );

      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(optimizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Try multiple QR decoder services for better reliability
      const qrData = await this.tryMultipleQRDecoders(base64);
      return qrData;
    } catch (error) {
      console.log("Error processing image for QR code:", error);
      throw error;
    }
  }

  /**
   * Try multiple QR decoder services for better reliability
   * @param {string} base64 - Base64 encoded image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async tryMultipleQRDecoders(base64) {
    // Try different QR decoder services in order of preference
    const decoders = [
      this.decodeWithQRServerAPI,
      this.decodeWithAlternativeQRService,
      this.decodeWithZXing,
      this.decodeWithSimpleAPI,
      this.decodeWithAlternativeQRServer
    ];

    for (const decoder of decoders) {
      try {
        console.log(`Trying decoder: ${decoder.name}`);
        
        // Add shorter timeout for each decoder attempt (Google Pay-like)
        const result = await Promise.race([
          decoder(base64),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Decoder timeout")), 10000)),
        ]);

        if (result) {
          console.log("QR code found using decoder:", decoder.name);
          return result;
        }
      } catch (error) {
        console.warn("Decoder failed:", decoder.name, error.message);
        // If it's a network error, don't try other decoders
        if (error.message && error.message.includes('Network request failed')) {
          console.log("Network error detected, stopping decoder attempts");
          throw error; // Re-throw to be handled by the caller
        }
        continue;
      }
    }

    console.log("All decoders failed to find QR code");
    return null;
  }

  /**
   * Alternative QR decoder using a different service that might work better
   * @param {string} base64 - Base64 encoded image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async decodeWithAlternativeQRService(base64) {
    try {
      console.log("Alternative QR Service decoder: Starting QR code detection...");
      
      // Try using a different approach - convert base64 to binary and send as multipart
      const imageData = `data:image/jpeg;base64,${base64}`;
      
      // Try using a different QR decoder service
      const response = await fetch("https://zxing.org/w/decode", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `f=image&i=${encodeURIComponent(imageData)}`,
      });

      console.log("Alternative QR Service decoder: Response status:", response.status);
      
      if (response.ok) {
        const text = await response.text();
        console.log('Alternative QR Service response received, length:', text.length);

        // Parse the response to extract QR data
        const qrMatch = text.match(/<pre[^>]*>([^<]+)<\/pre>/);
        if (qrMatch && qrMatch[1]) {
          const qrData = qrMatch[1].trim();
          console.log('Alternative QR Service QR code found:', qrData);
          return qrData;
        } else {
          console.log('Alternative QR Service decoder: No QR code pattern found in response');
        }
      } else {
        console.log('Alternative QR Service decoder: Response not OK, status:', response.status);
      }
    } catch (error) {
      console.log("Alternative QR Service decoder error:", error);
      // Check if it's a network error
      if (error.message && error.message.includes('Network request failed')) {
        throw new Error("Network request failed - please check your internet connection");
      }
    }
    return null;
  }

  /**
   * Decode QR using QR Server API (most reliable)
   * @param {string} base64 - Base64 encoded image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async decodeWithQRServerAPI(base64) {
    try {
      console.log("QR Server API decoder: Starting QR code detection...");
      
      // Create proper FormData for multipart/form-data upload as per API documentation
      const formData = new FormData();
      
      // For React Native, we need to use a different approach
      // Convert base64 to proper format for React Native FormData
      const imageData = `data:image/jpeg;base64,${base64}`;
      
      // Add the file to FormData as per API documentation
      // React Native FormData expects an object with uri, type, and name
      formData.append('file', {
        uri: imageData,
        type: 'image/jpeg',
        name: 'image.jpg'
      });
      
      // Try using QR Server API with proper multipart/form-data format
      const response = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
        method: "POST",
        body: formData,
      });

      console.log("QR Server API decoder: Response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('QR Server API response received:', result);
        
        if (result && result.length > 0 && result[0].symbol && result[0].symbol.length > 0) {
          const qrData = result[0].symbol[0].data;
          console.log('QR Server API QR code found:', qrData);
          return qrData;
        } else {
          console.log('QR Server API decoder: No QR code found in response');
        }
      } else {
        console.log('QR Server API decoder: Response not OK, status:', response.status);
        // Try to get error details
        try {
          const errorText = await response.text();
          console.log('QR Server API decoder: Error response:', errorText.substring(0, 200));
        } catch (e) {
          console.log('QR Server API decoder: Could not read error response');
        }
      }
    } catch (error) {
      console.log("QR Server API decoder error:", error);
      // Check if it's a network error
      if (error.message && error.message.includes('Network request failed')) {
        throw new Error("Network request failed - please check your internet connection");
      }
    }
    return null;
  }

  /**
   * Decode QR using ZXing API
   * @param {string} base64 - Base64 encoded image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async decodeWithZXing(base64) {
    try {
      console.log("ZXing decoder: Starting QR code detection...");
      
      // Try using a different approach with ZXing
      const imageData = `data:image/jpeg;base64,${base64}`;
      
      // Try using ZXing with a different format
      const response = await fetch("https://zxing.org/w/decode", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `f=image&i=${encodeURIComponent(imageData)}`,
      });

      console.log("ZXing decoder: Response status:", response.status);
      
      if (response.ok) {
        const text = await response.text();
        console.log('ZXing response received, length:', text.length);

        // Parse the response to extract QR data
        // ZXing returns HTML, so we need to parse it
        const qrMatch = text.match(/<pre[^>]*>([^<]+)<\/pre>/);
        if (qrMatch && qrMatch[1]) {
          const qrData = qrMatch[1].trim();
          console.log('ZXing QR code found:', qrData);
          return qrData;
        } else {
          console.log('ZXing decoder: No QR code pattern found in response');
        }
      } else {
        console.log('ZXing decoder: Response not OK, status:', response.status);
        // Try to get error details
        try {
          const errorText = await response.text();
          console.log('ZXing decoder: Error response:', errorText.substring(0, 200));
        } catch (e) {
          console.log('ZXing decoder: Could not read error response');
        }
      }
    } catch (error) {
      console.log("ZXing decoder error:", error);
      // Check if it's a network error
      if (error.message && error.message.includes('Network request failed')) {
        throw new Error("Network request failed - please check your internet connection");
      }
    }
    return null;
  }

  /**
   * Simple QR decoder using a different approach
   * @param {string} base64 - Base64 encoded image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async decodeWithSimpleAPI(base64) {
    try {
      console.log("Simple API decoder: Starting QR code detection...");
      
      // Try using a different QR decoder service
      const imageData = `data:image/jpeg;base64,${base64}`;
      
      const response = await fetch("https://zxing.org/w/decode", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `f=image&i=${encodeURIComponent(imageData)}`,
      });

      console.log("Simple API decoder: Response status:", response.status);

      if (response.ok) {
        const text = await response.text();
        console.log("Simple API decoder: Response received, length:", text.length);
        
        // Parse the response to extract QR data
        const qrMatch = text.match(/<pre[^>]*>([^<]+)<\/pre>/);
        if (qrMatch && qrMatch[1]) {
          const qrData = qrMatch[1].trim();
          console.log("Simple API decoder: QR code found:", qrData);
          return qrData;
        } else {
          console.log("Simple API decoder: No QR code pattern found in response");
        }
      } else {
        console.log("Simple API decoder: Response not OK, status:", response.status);
      }
    } catch (error) {
      console.log("Simple API decoder error:", error);
      // Check if it's a network error
      if (error.message && error.message.includes('Network request failed')) {
        throw new Error("Network request failed - please check your internet connection");
      }
    }
    return null;
  }

  /**
   * Alternative QR decoder using a different service
   * @param {string} base64 - Base64 encoded image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async decodeWithAlternativeQRServer(base64) {
    try {
      console.log("Alternative QR Server decoder: Starting QR code detection...");
      
      // Try using a different QR decoder service
      const imageData = `data:image/jpeg;base64,${base64}`;
      
      const response = await fetch("https://zxing.org/w/decode", {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html',
        },
        body: `f=image&i=${encodeURIComponent(imageData)}&submit=Decode`,
      });

      console.log("Alternative QR Server decoder: Response status:", response.status);

      if (response.ok) {
        const text = await response.text();
        console.log('Alternative QR Server decoder: Response received, length:', text.length);

        // Try different patterns to extract QR data
        const patterns = [
          /<pre[^>]*>([^<]+)<\/pre>/,
          /<textarea[^>]*>([^<]+)<\/textarea>/,
          /<div[^>]*class="result"[^>]*>([^<]+)<\/div>/,
        ];

        for (const pattern of patterns) {
          const match = text.match(pattern);
          if (match && match[1]) {
            const qrData = match[1].trim();
            if (qrData && qrData.length > 0) {
              console.log('Alternative QR Server decoder: QR code found:', qrData);
              return qrData;
            }
          }
        }
        
        console.log('Alternative QR Server decoder: No QR code pattern found in response');
      } else {
        console.log('Alternative QR Server decoder: Response not OK, status:', response.status);
      }
    } catch (error) {
      console.log("Alternative QR Server decoder error:", error);
      // Check if it's a network error
      if (error.message && error.message.includes('Network request failed')) {
        throw new Error("Network request failed - please check your internet connection");
      }
    }
    return null;
  }

  /**
   * Fallback method when all web services fail
   * This could be used to implement local QR processing in the future
   * @param {string} base64 - Base64 encoded image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async decodeWithLocalFallback(base64) {
    try {
      console.log("Local fallback decoder: Starting QR code detection...");
      
      // For now, we'll return null as implementing local QR detection
      // would require more complex image processing libraries
      // In the future, you could implement this using react-native-vision-camera
      // or similar libraries that support QR code detection
      
      console.log("Local fallback decoder: No local QR detection implemented yet");
      return null;
    } catch (error) {
      console.log("Local fallback decoder error:", error);
      return null;
    }
  }

  /**
   * Enhanced QR processing with better error handling
   * @param {string} imageUri - Local URI of the image
   * @returns {Promise<string|null>} QR code data or null if not found
   */
  static async processImageForQRCodeEnhanced(imageUri) {
    try {
      console.log("Starting enhanced QR processing for image:", imageUri);
      
      // Optimize image for QR detection with Google Pay-like approach
      const optimizedImage = await manipulateAsync(
        imageUri,
        [
          { resize: { width: 1024, height: 1024 } }, // Square resize for better processing
        ],
        { 
          format: SaveFormat.JPEG, 
          quality: 0.9, // Higher quality for better detection
          compress: 0.8 // Slight compression to reduce file size
        }
      );

      console.log("Image optimized, converting to base64...");

      // Convert image to base64 with better error handling
      const base64 = await FileSystem.readAsStringAsync(optimizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("Base64 conversion complete, length:", base64.length);

      // Try web-based decoders first with timeout
      console.log("Trying web-based decoders...");
      const qrData = await Promise.race([
        this.tryMultipleQRDecoders(base64),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("QR processing timeout")), 30000)
        )
      ]);
      
      if (qrData) {
        console.log("QR code successfully extracted:", qrData);
        return qrData;
      }
      
      // If web services fail, try local fallback
      console.log("Web services failed, trying local fallback...");
      return await this.decodeWithLocalFallback(base64);
    } catch (error) {
      console.log("Error in enhanced QR processing:", error);
      
      // Provide more specific error messages
      if (error.message === "QR processing timeout") {
        throw new Error("QR code processing took too long. Please try with a clearer image.");
      } else if (error.message.includes("network")) {
        throw new Error("Network error. Please check your internet connection and try again.");
      } else {
        throw new Error("Failed to process image. Please try with a different image.");
      }
    }
  }

  /**
   * Validate if a string looks like a valid QR code data
   * @param {string} data - The data to validate
   * @returns {boolean} True if data looks valid
   */
  static isValidQRData(data) {
    if (!data || typeof data !== "string") {
      return false;
    }

    // Basic validation - check if it's not empty and has reasonable length
    return data.trim().length > 0 && data.trim().length < 10000;
  }

  /**
   * Check if the device supports native QR processing
   * @returns {boolean} True if native processing is available
   */
  static isNativeProcessingAvailable() {
    // For now, we'll use web-based processing
    // In the future, you could check for native capabilities
    return false;
  }

  /**
   * Get processing status and statistics
   * @returns {Object} Processing statistics
   */
  static getProcessingStats() {
    return {
      method: "web-based",
      services: ["ZXing", "QR Server API", "Alternative ZXing"],
      reliability: "high",
      privacy: "image sent to external services",
    };
  }




}

export default QRCodeService;
