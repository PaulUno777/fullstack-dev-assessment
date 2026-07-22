# frozen_string_literal: true

require "test_helper"

class Candidates::UpdateStatusTest < ActiveSupport::TestCase
  setup do
    @candidate = Candidate.create!(
      name: "Policy Person",
      years_exp: 3,
      status: "pending",
      date_applied: Time.current,
      reviewed: false,
      description: "test"
    )
  end

  test "sets reviewed when pending becomes accepted" do
    result = Candidates::UpdateStatus.call(candidate: @candidate, status: "accepted")

    assert result.ok?
    assert_equal "accepted", result.candidate.status
    assert_equal true, result.candidate.reviewed
  end

  test "does not change locked candidate" do
    @candidate.update!(status: "accepted", reviewed: true)

    result = Candidates::UpdateStatus.call(candidate: @candidate, status: "rejected")

    assert_not result.ok?
    assert_equal :status_locked, result.error_code
    assert_equal "accepted", @candidate.reload.status
  end
end
