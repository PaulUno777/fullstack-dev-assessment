# frozen_string_literal: true

module Candidates
  class MarkReviewed
    Result = Struct.new(:ok?, :candidate, :error_code, keyword_init: true)

    def self.call(candidate:, reviewed: true)
      new(candidate: candidate, reviewed: reviewed).call
    end

    def initialize(candidate:, reviewed:)
      @candidate = candidate
      @reviewed = ActiveModel::Type::Boolean.new.cast(reviewed)
    end

    def call
      return Result.new(ok?: false, candidate: @candidate, error_code: "invalid_params") if @reviewed.nil?
      return Result.new(ok?: true, candidate: @candidate, error_code: nil) if @candidate.reviewed == @reviewed

      @candidate.reviewed = @reviewed
      @candidate.save!

      Result.new(ok?: true, candidate: @candidate, error_code: nil)
    end
  end
end
