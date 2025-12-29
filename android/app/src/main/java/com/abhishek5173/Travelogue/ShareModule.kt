package com.abhishek5173.Travelogue

import android.content.Intent
import com.facebook.react.bridge.*

class ShareModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  override fun getName() = "ShareModule"

  @ReactMethod
  fun getSharedText(promise: Promise) {
    val activity = context.currentActivity
    if (activity == null) {
      promise.resolve(null)
      return
    }

    val intent = activity.intent

    // Try EXTRA_TEXT
    var text = intent.getStringExtra(Intent.EXTRA_TEXT)

    // Try EXTRA_SUBJECT
    if (text.isNullOrEmpty()) {
      text = intent.getStringExtra(Intent.EXTRA_SUBJECT)
    }

    // Normalize Instagram redirect
    if (text?.contains("l.instagram.com") == true) {
      val uri = android.net.Uri.parse(text)
      text = uri.getQueryParameter("u")
    }

    promise.resolve(text)
  }
}
