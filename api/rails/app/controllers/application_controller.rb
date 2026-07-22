# frozen_string_literal: true

class ApplicationController < ActionController::API
  before_action :set_locale

  private

  def set_locale
    I18n.locale = extract_locale || I18n.default_locale
  end

  def extract_locale
    header = request.env["HTTP_ACCEPT_LANGUAGE"].to_s
    return if header.blank?

    requested = header.split(",").map { |part| part.split(";").first.to_s.strip.downcase }
    available = I18n.available_locales.map { |locale| locale.to_s.downcase }
    requested.each do |locale|
      return locale.to_sym if available.include?(locale)

      short = locale.split("-").first
      return short.to_sym if available.include?(short)
    end
    nil
  end
end
